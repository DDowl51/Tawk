import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import io, { Socket } from 'socket.io-client';
import { useAppDispatch } from 'store';
import { selectAuth } from 'store/auth/auth.slice';
import {
  AddChatroom,
  AddMessage,
  AddUserFriend,
  ReceivedFriendRequest,
  SetFriendOffline,
  SetFriendOnline,
} from 'store/data/data.action';
import {
  ClientEvents,
  FriendRequest,
  GroupChatroom,
  MessageType,
  User,
  WebRTCEvents,
} from 'types';
import {
  selectMedia,
  setAnswerData,
  setLoading,
  setStatus,
  setTargetUser,
  setTimer,
  setType,
} from 'store/media/media.slice';
import {
  AddCandidate,
  CloseConnection,
  EndCall,
  HandleAnswer,
  SetRemote,
} from 'store/media/media.action';

export let socket: Socket;

const SocketInit = () => {
  const { token } = useSelector(selectAuth);
  const dispatch = useAppDispatch();

  const { status } = useSelector(selectMedia);

  useEffect(() => {
    if (token) {
      socket = io('wss://192.168.0.102:5002', { auth: { token } });
      console.log('connected');
      socket.on('disconnect', reason => {
        console.log(`disconnected, reason: ${reason}`);
      });
      socket.on('connect_error', err => {
        toast.error(err.message);
      });
      socket.on(ClientEvents.Error, reason => {
        toast.error(reason);
      });
      socket.on(ClientEvents.ReceiveFriendRequest, (request: FriendRequest) => {
        dispatch(ReceivedFriendRequest(request));
      });
      socket.on(ClientEvents.HandleFriendRequest, (request: FriendRequest) => {
        dispatch(AddUserFriend(request.recipient));
      });
      socket.on(ClientEvents.NewMessage, (message: MessageType) => {
        dispatch(AddMessage(message));
      });
      socket.on(ClientEvents.FriendOnline, (fId: string) => {
        dispatch(SetFriendOnline(fId));
      });
      socket.on(ClientEvents.FriendOffline, (fId: string) => {
        dispatch(SetFriendOffline(fId));
      });
      socket.on(ClientEvents.JoinGroup, (chatroom: GroupChatroom) => {
        dispatch(AddChatroom(chatroom));
      });
    }

    return () => {
      if (socket && socket.connected) {
        socket.disconnect();
      }
    };
  }, [token, dispatch]);

  useEffect(() => {
    // ---------- WebRTC events
    if (socket) {
      socket.on(
        WebRTCEvents.Offer,
        (data: {
          remoteSDP: RTCSessionDescriptionInit;
          from: User;
          type: 'audio' | 'video';
        }) => {
          if (status !== 'idle') {
            socket.emit(WebRTCEvents.EndCall, {
              type: data.type,
              to: data.from._id,
              reason: 'busy',
            });
            return;
          }
          dispatch(setType(data.type));
          dispatch(setAnswerData(data));
          dispatch(setLoading(false));
          dispatch(setStatus('answering'));
          dispatch(setTargetUser(data.from));
          // auto reject on 60s
          const rejectTimer = setTimeout(() => {
            dispatch(EndCall('Time out'));
            dispatch(setTimer(null));
          }, 60000);
          dispatch(setTimer(rejectTimer));
        }
      );

      socket.on(
        WebRTCEvents.Answer,
        (data: {
          remoteSDP: RTCSessionDescriptionInit;
          from: User;
          type: 'audio' | 'video';
        }) => {
          dispatch(HandleAnswer(data));
        }
      );

      socket.on(WebRTCEvents.Candidate, (candidate: RTCIceCandidate) => {
        dispatch(AddCandidate(candidate));
      });

      socket.on(WebRTCEvents.EndCall, (reason: string) => {
        dispatch(CloseConnection(reason));
      });

      socket.on(WebRTCEvents.Error, (reason: string) => {
        dispatch(CloseConnection(reason));
      });

      socket.on(WebRTCEvents.Microphone, (muted: boolean) => {
        dispatch(SetRemote('microphone', muted));
      });
      socket.on(WebRTCEvents.Speaker, (muted: boolean) => {
        dispatch(SetRemote('speaker', muted));
      });
    }

    return () => {
      Object.values(WebRTCEvents).forEach(evName => {
        socket.off(evName);
      });
    };
  }, [dispatch, status]);

  return <></>;
};

export const useSocket = () => socket;

export default SocketInit;
