import { useSocket } from 'hooks/useSocket';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAppDispatch } from 'store';
import { SetSnackbar } from 'store/ui/ui.action';
import { User, WebRTCEvents } from 'types';

type VideoStatus = 'idle' | 'offering' | 'calling' | 'answering' | 'producing'; // producing: 在answering之后calling之前， 通知呼叫方我已接受通话
type ContextType = {
  status: VideoStatus;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  loading: boolean;
  createOffer: () => Promise<void>;
  answerOffer: () => void;
  rejectOffer: (reason: string) => void;
  timeoutReject: number;
  targetUser: Omit<User, 'friends'> | null;
};
type AnswerData = {
  remoteSDP: RTCSessionDescriptionInit;
  from: Omit<User, 'friends'>;
};

export const VideoContext = createContext<ContextType>({
  status: 'idle',
  localVideoRef: { current: null },
  remoteVideoRef: { current: null },
  createOffer: async () => {},
  answerOffer: async () => {},
  rejectOffer: () => {},
  loading: false,
  timeoutReject: -1, // 超时自动拒绝
  targetUser: null,
});

const VideoContextProvider: FC<
  PropsWithChildren<{ to: Omit<User, 'friends'> }>
> = ({ children, to }) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<VideoStatus>('idle');
  const [loading, setLoading] = useState(false); // Button loading state
  const [answerData, setAnswerData] = useState<AnswerData | null>(null);
  const [timeoutReject, setTimeoutReject] = useState(-1); // 接听时间， 超时默认拒绝
  const timerRef = useRef<NodeJS.Timer>(); // setInterval 的标记
  // const [timer, setTimer] = useState<NodeJS.Timer>();
  const [targetUser, setTargetUser] = useState<Omit<User, 'friends'> | null>(
    null
  );
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socket = useSocket();
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const getUserMedia = async () => {
    return navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then(stream => {
        localVideoRef.current!.srcObject = stream;
        return stream;
      });
  };

  const createPeerConnection = useCallback(
    (localStream: MediaStream, targetUser: Omit<User, 'friends'>) => {
      if (!pcRef.current) {
        pcRef.current = new RTCPeerConnection({
          iceServers: [
            {
              urls: ['turn:106.54.187.163:3478'],
              username: 'ddowl',
              credential: '123654',
            },
            { urls: ['stun:106.54.187.163:3478'] },
          ],
          iceTransportPolicy: 'all',
        });

        pcRef.current.onicecandidate = event => {
          if (event.candidate) {
            socket.emit(WebRTCEvents.Candidate, {
              candidate: event.candidate,
              to: targetUser?._id,
            });
          }
        };

        pcRef.current.ontrack = event => {
          remoteVideoRef.current!.srcObject = event.streams[0];
        };

        localStream?.getTracks().forEach(track => {
          pcRef.current?.addTrack(track, localStream);
        });
      }
    },
    [socket]
  );

  const createOffer = useCallback(async () => {
    setTargetUser(to);
    const stream = await getUserMedia();
    createPeerConnection(stream, to);
    const localSDP = await pcRef.current!.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    pcRef.current?.setLocalDescription(localSDP);
    // send localsdp to target user
    socket.emit(WebRTCEvents.Offer, { sdp: localSDP, to: to._id });
    setStatus('offering');
    setLoading(true);
  }, [createPeerConnection, socket, to]);

  const createAnswer = useCallback(
    async (data: AnswerData) => {
      const { remoteSDP, from } = data;
      clearInterval(timerRef.current);
      setStatus('producing');
      const stream = await getUserMedia();
      createPeerConnection(stream, data.from);
      pcRef.current?.setRemoteDescription(remoteSDP);
      const localSDP = await pcRef.current?.createAnswer();
      pcRef.current?.setLocalDescription(localSDP);
      socket.emit(WebRTCEvents.Answer, { sdp: localSDP, to: from._id }, () => {
        setStatus('calling');
        setLoading(false);
      });
    },
    [createPeerConnection, socket, timerRef]
  );

  const answerOffer = useCallback(() => {
    setTimeoutReject(-1);
    console.log('关闭倒计时', timerRef.current);
    clearInterval(timerRef.current);
    if (answerData) {
      console.log(answerData.from.name);
      setLoading(true);
      createAnswer(answerData);
    }
  }, [answerData, createAnswer, timerRef]);
  const closeConnection = useCallback(() => {
    setStatus('idle');
    setTimeoutReject(-1);
    clearInterval(timerRef.current);
    setLoading(false);
    setAnswerData(null);
    setTargetUser(null);
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach(track => track.stop());
    }
    remoteVideoRef.current!.srcObject = null;
    localVideoRef.current!.srcObject = null;
    pcRef.current?.close();
    pcRef.current = null;
  }, [timerRef]);

  const rejectOffer = useCallback(
    (reason: string) => {
      setStatus('idle');
      console.log('关闭计时 on reject', timerRef.current);
      clearInterval(timerRef.current);
      setTimeoutReject(-1);
      setLoading(true);
      setTargetUser(null);
      socket.emit(
        WebRTCEvents.Reject,
        { to: targetUser?._id, reason },
        closeConnection
      );
    },
    [socket, targetUser?._id, timerRef, closeConnection]
  );

  useEffect(() => {
    if (timeoutReject === 0) {
      // 超时， 自动拒绝
      console.log('timeout reject');
      clearInterval(timerRef.current);
      rejectOffer('Timeout');
    } else if (timeoutReject <= -1 && status === 'answering') {
      // 收到邀请， 开始倒计时
      setTimeoutReject(60); // 60秒后自动拒绝
      timerRef.current = setInterval(() => {
        setTimeoutReject(prev => prev - 1);
      }, 1000);
    }
  }, [rejectOffer, status, timeoutReject, timerRef]);

  useEffect(() => {
    socket.on(WebRTCEvents.Offer, (data: AnswerData) => {
      // 收到通话邀请， 超时默认拒绝
      setLoading(false);
      setStatus('answering');
      setAnswerData(data);
      setTargetUser(data.from);
    });
    socket.on(WebRTCEvents.Answer, (remoteSDP: RTCSessionDescriptionInit) => {
      pcRef.current?.setRemoteDescription(remoteSDP);
      setStatus('calling');
      setLoading(false);
    });
    socket.on(WebRTCEvents.Candidate, (candidate: RTCIceCandidate) => {
      pcRef.current?.addIceCandidate(candidate);
    });

    socket.on(WebRTCEvents.Reject, (reason: string) => {
      dispatch(SetSnackbar(true, 'warning', `Call ended, reason: ${reason}`));
      // close peer connection
      closeConnection();
    });

    socket.on(WebRTCEvents.Error, (reason: string) => {
      dispatch(SetSnackbar(true, 'error', reason));
      closeConnection();
    });

    return () => {
      socket.off(WebRTCEvents.Offer);
      socket.off(WebRTCEvents.Answer);
      socket.off(WebRTCEvents.Candidate);
      socket.off(WebRTCEvents.Reject);
      socket.off(WebRTCEvents.Error);
    };
  }, [socket, createAnswer, dispatch, closeConnection]);

  return (
    <VideoContext.Provider
      value={{
        status,
        localVideoRef,
        remoteVideoRef,
        createOffer,
        answerOffer,
        rejectOffer,
        loading,
        timeoutReject,
        targetUser,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
