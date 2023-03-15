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
import { ClientEvents, FriendRequest, GroupChatroom, MessageType } from 'types';

let socket: Socket;

const SocketInit = () => {
  const { token } = useSelector(selectAuth);
  const dispatch = useAppDispatch();

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

  return <></>;
};

export const useSocket = () => socket;

export default SocketInit;
