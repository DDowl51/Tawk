import { socket } from 'hooks/useSocket';
import toast from 'react-hot-toast';
import { AppThunk } from 'store';
import { User, WebRTCEvents } from 'types';
import {
  setLoading,
  setLocalDevices,
  setLocalMediaId,
  setRemoteDevices,
  setRemoteMediaId,
  setStatus,
  setTargetUser,
  setTimer,
  setType,
} from './media.slice';

const pcConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: ['turn:106.54.187.163:3478'],
      username: 'ddowl',
      credential: '123654',
    },
    { urls: ['stun:106.54.187.163:3478'] },
  ],
  iceTransportPolicy: 'all',
};

let _pc: RTCPeerConnection | null;
let _localStream: MediaStream | null;

const CreatePeerConnection = (): AppThunk => (dispatch, getState) => {
  if (_pc) {
    return toast.error('Peer connection already created!');
  }
  _pc = new RTCPeerConnection(pcConfig);

  // on ice candidate
  _pc.onicecandidate = event => {
    if (event.candidate) {
      socket.emit(WebRTCEvents.Candidate, {
        candidate: event.candidate,
        to: getState().media.targetUser?._id,
      });
    }
  };

  const { remoteMediaId } = getState().media;
  _pc.ontrack = event => {
    // add remote stream track
    if (remoteMediaId) {
      (document.getElementById(remoteMediaId) as HTMLMediaElement).srcObject =
        event.streams[0];
    }
  };

  // add localStream track to pc for sending it to remote
  _localStream?.getTracks().forEach(track => {
    _pc?.addTrack(track, _localStream!);
  });
};

export const CreateOffer =
  (type: 'audio' | 'video', targetUser: Omit<User, 'friends'>): AppThunk =>
  async (dispatch, getState) => {
    // if is alreading calling, reject
    if (getState().media.status !== 'idle') {
      return toast.error('Cannot call, busy');
    }

    dispatch(setRemoteMediaId(`remote-${type}`));
    dispatch(setLocalMediaId(`local-${type}`));

    // set status and loading
    dispatch(setStatus('offering'));
    dispatch(setLoading(true));
    dispatch(setType(type));

    // set target user
    dispatch(setTargetUser(targetUser));

    // get user media infomation
    _localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === 'video',
    });

    // set local steam to local video
    (
      document.getElementById(getState().media.localMediaId) as HTMLMediaElement
    ).srcObject = _localStream;

    // create peer connection
    dispatch(CreatePeerConnection());

    // generate local sdp
    const localSDP = await _pc?.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: type === 'video',
    });
    _pc?.setLocalDescription(localSDP);

    // send local sdp to remote end
    socket.emit(WebRTCEvents.Offer, {
      type,
      sdp: localSDP,
      to: targetUser._id,
    });
    dispatch(setLoading(false));
  };

export const CreateAnswer =
  (
    type: 'audio' | 'video',
    remoteSDP: RTCSessionDescriptionInit,
    from: Omit<User, 'friends'>
  ): AppThunk =>
  async (dispatch, getState) => {
    // set status and loading
    // now offer has been accepted, and start producing answer data
    dispatch(setStatus('producing'));
    dispatch(setLoading(false));

    dispatch(setRemoteMediaId(`remote-${type}`));
    dispatch(setLocalMediaId(`local-${type}`));

    clearTimeout(getState().media.timer!);
    dispatch(setTimer(null));

    // set target user
    dispatch(setTargetUser(from));

    // get user media
    _localStream = await navigator.mediaDevices.getUserMedia({
      video: type === 'video',
      audio: true,
    });

    // set local steam to local video
    (
      document.getElementById(getState().media.localMediaId) as HTMLMediaElement
    ).srcObject = _localStream;

    // create peer connection
    dispatch(CreatePeerConnection());

    // set remote sdp
    _pc?.setRemoteDescription(remoteSDP);

    // create local sdp and send
    const localSDP = await _pc?.createAnswer();
    _pc?.setLocalDescription(localSDP);
    socket.emit(
      WebRTCEvents.Answer,
      {
        sdp: localSDP,
        to: from._id,
      },
      // callback after socket return
      () => {
        dispatch(setStatus('calling'));
        dispatch(setLoading(false));
      }
    );
  };

export const HandleAnswer =
  (data: {
    remoteSDP: RTCSessionDescriptionInit;
    from: User;
    type: 'audio' | 'video';
  }): AppThunk =>
  (dispatch, getState) => {
    // set remote sdp
    _pc?.setRemoteDescription(data.remoteSDP);

    // set status to calling
    dispatch(setStatus('calling'));
    dispatch(setLoading(false));
  };

export const AddCandidate =
  (candidate: RTCIceCandidate): AppThunk =>
  (dispatch, getState) => {
    _pc?.addIceCandidate(candidate);
  };

// 断开连接, 不需要通知对方
// Hang up 之后调用， 或者收到对方Hang up 时调用
export const CloseConnection =
  (reason: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(setStatus('idle'));
    dispatch(setLoading(false));
    dispatch(setTargetUser(null));
    // muted?
    dispatch(setLocalDevices({ microphone: false, speaker: false }));
    dispatch(setRemoteDevices({ microphone: false, speaker: false }));
    // stop local stream track
    const { localMediaId, remoteMediaId } = getState().media;
    if (_localStream) {
      _localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteMediaId) {
      (document.getElementById(remoteMediaId) as HTMLMediaElement).srcObject =
        null;
    }
    if (localMediaId) {
      (document.getElementById(localMediaId) as HTMLMediaElement).srcObject =
        null;
    }
    _pc?.close();
    _pc = null;

    toast.error(`Call ended, reason: ${reason}`);
    console.log(reason);
  };

export const EndCall =
  (reason: string = 'Unknown'): AppThunk =>
  (dispatch, getState) => {
    const { targetUser } = getState().media;
    // tell the remote end rejected
    socket.emit(WebRTCEvents.EndCall, {
      to: targetUser?._id,
      reason: reason,
    });

    // close connection
    dispatch(CloseConnection(reason));
  };

export const SetLocal =
  (device: 'microphone' | 'speaker', muted: boolean): AppThunk =>
  (dispatch, getState) => {
    const { targetUser } = getState().media;

    switch (device) {
      case 'microphone':
        dispatch(setLocalDevices({ microphone: muted }));
        socket.emit(WebRTCEvents.Microphone, { to: targetUser?._id, muted });
        if (_localStream) {
          _localStream
            .getAudioTracks()
            .forEach(track => (track.enabled = !muted));
        }
        break;
      case 'speaker':
        dispatch(setLocalDevices({ speaker: muted }));
        socket.emit(WebRTCEvents.Speaker, { to: targetUser?._id, muted });
        break;
    }
  };

export const SetRemote =
  (device: 'microphone' | 'speaker', muted: boolean): AppThunk =>
  dispatch => {
    dispatch(setRemoteDevices({ [device]: muted }));
  };
