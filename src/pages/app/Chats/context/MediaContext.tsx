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
import toast from 'react-hot-toast';
import { useAppDispatch } from 'store';
import { User, WebRTCEvents } from 'types';

type VideoStatus = 'idle' | 'offering' | 'calling' | 'answering' | 'producing'; // producing: 在answering之后calling之前， 通知呼叫方我已接受通话
type ContextType = {
  status: VideoStatus;
  localMediaRef: React.RefObject<HTMLMediaElement>;
  remoteMediaRef: React.RefObject<HTMLMediaElement>;
  loading: boolean;
  createOffer: () => Promise<void>;
  answerOffer: () => void;
  rejectOffer: (reason: string) => void;
  setOnAnswer: (fn: Function) => void;
  setOnEnd: (fn: Function) => void;
  timeoutReject: number;
  targetUser: Omit<User, 'friends'> | null;
  setMicrophone: (enabled: boolean) => void;
  setSpeaker: (enabled: boolean) => void;
  friendMicMuted: boolean;
  friendSpeakerMuted: boolean;
};
type OfferData = {
  type: 'audio' | 'video';
  remoteSDP: RTCSessionDescriptionInit;
  from: Omit<User, 'friends'>;
};
type AnswerData = {
  type: 'audio' | 'video';
  remoteSDP: RTCSessionDescriptionInit;
  from: Omit<User, 'friends'>;
};
type CandidateData = {
  type: 'audio' | 'video';
  candidate: RTCIceCandidate;
};

export const MediaContext = createContext<ContextType>({
  status: 'idle',
  localMediaRef: { current: null },
  remoteMediaRef: { current: null },
  createOffer: async () => {},
  answerOffer: async () => {},
  rejectOffer: () => {},
  loading: false,
  timeoutReject: -1, // 超时自动拒绝
  targetUser: null,
  setOnAnswer: () => {},
  setOnEnd: () => {},
  setMicrophone: () => {},
  setSpeaker: () => {},
  friendMicMuted: false,
  friendSpeakerMuted: false,
});

const MediaContextProvider: FC<
  PropsWithChildren<{ to: Omit<User, 'friends'>; type: 'audio' | 'video' }>
> = ({ children, to, type }) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<VideoStatus>('idle');
  const [loading, setLoading] = useState(false); // Button loading state
  const [answerData, setAnswerData] = useState<AnswerData | null>(null);
  const [timeoutReject, setTimeoutReject] = useState(-1); // 接听时间， 超时默认拒绝
  const timerRef = useRef<NodeJS.Timer>(); // setInterval 的标记
  const [onAnswer, setOnAnswer] = useState<Function>(); // 成功建立连接之后的callback
  const [onEnd, setOnEnd] = useState<Function>(); // 成功建立连接之后的callback
  const [targetUser, setTargetUser] = useState<Omit<User, 'friends'> | null>(
    null
  );
  const [friendMicMuted, setFriendMicMuted] = useState(false);
  const [friendSpeakerMuted, setFriendSpeakerMuted] = useState(false);
  const localMediaRef = useRef<HTMLMediaElement>(null);
  const localStreamRef = useRef<MediaStream>();
  const remoteMediaRef = useRef<HTMLMediaElement>(null);
  const socket = useSocket();
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const getUserMedia = useCallback(async () => {
    return navigator.mediaDevices
      .getUserMedia({
        video: type === 'video',
        audio: true,
      })
      .then(stream => {
        localMediaRef.current!.srcObject = stream;
        return stream;
      });
  }, [type]);

  const createPeerConnection = useCallback(
    (targetUser: Omit<User, 'friends'>) => {
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
              type,
            });
          }
        };

        pcRef.current.ontrack = event => {
          remoteMediaRef.current!.srcObject = event.streams[0];
        };

        localStreamRef.current?.getTracks().forEach(track => {
          pcRef.current?.addTrack(track, localStreamRef.current!);
        });
      }
    },
    [socket, type]
  );

  const createOffer = useCallback(async () => {
    if (status !== 'idle') {
      toast.error('Cannot call, busy');
      return;
    }
    setLoading(true);

    setTargetUser(to);
    localStreamRef.current = await getUserMedia();
    createPeerConnection(to);
    const localSDP = await pcRef.current!.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: type === 'video',
    });
    pcRef.current?.setLocalDescription(localSDP);
    // send localsdp to target user
    socket.emit(WebRTCEvents.Offer, {
      type,
      sdp: localSDP,
      to: to._id,
    });
    setStatus('offering');
    setLoading(false);
  }, [createPeerConnection, socket, to, type, getUserMedia, status]);

  const createAnswer = useCallback(
    async (data: OfferData) => {
      const { remoteSDP, from } = data;
      clearInterval(timerRef.current);
      setStatus('producing');
      localStreamRef.current = await getUserMedia();
      createPeerConnection(data.from);
      pcRef.current?.setRemoteDescription(remoteSDP);
      const localSDP = await pcRef.current?.createAnswer();
      pcRef.current?.setLocalDescription(localSDP);
      socket.emit(
        WebRTCEvents.Answer,
        { type, sdp: localSDP, to: from._id },
        () => {
          setStatus('calling');
          setLoading(false);
        }
      );
    },
    [createPeerConnection, socket, timerRef, getUserMedia, type]
  );

  const answerOffer = useCallback(() => {
    setTimeoutReject(-1);
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
    setFriendMicMuted(false);
    setFriendSpeakerMuted(false);
    if (localMediaRef.current?.srcObject) {
      (localMediaRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach(track => track.stop());
    }
    remoteMediaRef.current!.srcObject = null;
    localMediaRef.current!.srcObject = null;
    pcRef.current?.close();
    pcRef.current = null;

    if (onEnd) {
      onEnd();
    }
  }, [timerRef, onEnd]);

  const rejectOffer = useCallback(
    (reason: string) => {
      setStatus('idle');
      clearInterval(timerRef.current);
      setTimeoutReject(-1);
      setLoading(true);
      setTargetUser(null);
      socket.emit(
        WebRTCEvents.Reject,
        { type, to: targetUser?._id, reason },
        closeConnection
      );
    },
    [socket, targetUser?._id, timerRef, closeConnection, type]
  );

  const setMicrophone = useCallback(
    (enabled: boolean) => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          if (track.kind === 'audio') {
            track.enabled = enabled;
          }
        });
        socket.emit(WebRTCEvents.Microphone, {
          to: targetUser?._id,
          enabled,
          type,
        });
      }
    },
    [targetUser, socket, type]
  );

  const setSpeaker = useCallback(
    (enabled: boolean) => {
      socket.emit(WebRTCEvents.Speaker, {
        to: targetUser?._id,
        enabled,
        type,
      });
    },
    [targetUser, socket, type]
  );

  useEffect(() => {
    if (timeoutReject === 0) {
      // 超时， 自动拒绝
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
    socket.on(WebRTCEvents.Offer, (data: OfferData) => {
      if (data.type !== type) return;
      // 当前正在通话中
      if (status !== 'idle') {
        socket.emit(WebRTCEvents.Reject, {
          type,
          to: data.from._id,
          reason: 'busy',
        });
        return;
      }

      // 收到通话邀请， 超时默认拒绝
      setLoading(false);
      setStatus('answering');
      setAnswerData(data);
      setTargetUser(data.from);
    });
    socket.on(WebRTCEvents.Answer, (data: AnswerData) => {
      if (data.type !== type) return;
      pcRef.current?.setRemoteDescription(data.remoteSDP);
      setStatus('calling');
      setLoading(false);
      if (onAnswer) {
        onAnswer();
      }
    });
    socket.on(WebRTCEvents.Candidate, (data: CandidateData) => {
      if (data.type !== type) return;
      pcRef.current?.addIceCandidate(data.candidate);
    });

    socket.on(
      WebRTCEvents.Reject,
      (data: { type: 'audio' | 'video'; reason: string }) => {
        if (data.type !== type) return;
        toast.error(`Call ended, reason: ${data.reason}`);
        // close peer connection
        closeConnection();
      }
    );

    socket.on(
      WebRTCEvents.Error,
      (data: { type: 'audio' | 'video'; reason: string }) => {
        if (data.type !== type) return;
        toast.error(data.reason);
        closeConnection();
      }
    );

    socket.on(
      WebRTCEvents.Microphone,
      (data: { type: 'audio' | 'video'; enabled: boolean }) => {
        if (data.type !== type) return;
        toast.success(
          `Friend ${data.enabled ? 'enabled' : 'disabled'} microphone`
        );
        setFriendMicMuted(!data.enabled);
      }
    );

    socket.on(
      WebRTCEvents.Speaker,
      (data: { type: 'audio' | 'video'; enabled: boolean }) => {
        if (data.type !== type) return;
        toast.success(
          `Friend ${data.enabled ? 'enabled' : 'disabled'} speaker`
        );
        setFriendSpeakerMuted(!data.enabled);
      }
    );

    return () => {
      socket.off(WebRTCEvents.Offer);
      socket.off(WebRTCEvents.Answer);
      socket.off(WebRTCEvents.Candidate);
      socket.off(WebRTCEvents.Reject);
      socket.off(WebRTCEvents.Error);
      socket.off(WebRTCEvents.Microphone);
      socket.off(WebRTCEvents.Speaker);
    };
  }, [socket, createAnswer, dispatch, closeConnection, type, status, onAnswer]);

  return (
    <MediaContext.Provider
      value={{
        status,
        localMediaRef,
        remoteMediaRef,
        createOffer,
        answerOffer,
        rejectOffer,
        setOnAnswer,
        setOnEnd,
        loading,
        timeoutReject,
        targetUser,
        setMicrophone,
        setSpeaker,
        friendMicMuted,
        friendSpeakerMuted,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaContextProvider;
