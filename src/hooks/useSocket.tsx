import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import { useAppDispatch } from 'store';
import { selectAuth } from 'store/auth/auth.slice';
import { AddMessage, ReceivedFriendRequest } from 'store/data/data.action';
import { SetSnackbar } from 'store/ui/ui.action';
import { ClientEvents, FriendRequest, MessageType } from 'types';

let socket: Socket;

const SocketInit = () => {
  const { token } = useSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      socket = io('http://localhost:5000', { auth: { token } });
      console.log('connected');
      socket.on('disconnect', reason => {
        console.log(`disconnected, reason: ${reason}`);
      });
      socket.on('connect_error', err => {
        dispatch(SetSnackbar(true, 'error', err.message));
      });
      socket.on(ClientEvents.Error, reason => {
        dispatch(SetSnackbar(true, 'error', reason));
      });
      socket.on(ClientEvents.ReceiveFriendRequest, (request: FriendRequest) => {
        console.log(request);
        dispatch(ReceivedFriendRequest(request));
      });
      socket.on(ClientEvents.NewMessage, (message: MessageType) => {
        console.log(message);
        dispatch(AddMessage(message));
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
