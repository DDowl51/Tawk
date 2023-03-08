import { AppThunk } from 'store';
import { FriendRequest, MessageType, User } from 'types';
import {
  addChatroom,
  addFriendRequest,
  addMessage,
  addUserFriend,
  pinChatroom,
  setCurrentChatroomId,
  setFriendRequest,
  setFriendState,
  setLastMesasge,
} from './data.slice';
import * as Request from 'requests';

export const SetFriendOnline =
  (friendId: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(setFriendState({ friendId, online: true }));
  };

export const AddUserFriend =
  (friend: User): AppThunk =>
  (dispatch, getState) => {
    dispatch(addUserFriend(friend));
  };

export const SetFriendOffline =
  (friendId: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(setFriendState({ friendId, online: false }));
  };

export const ReceivedFriendRequest =
  (request: FriendRequest): AppThunk =>
  (dispatch, getState) => {
    const requests = getState().data.friendRequests;
    const index = requests.findIndex(r => r._id === request._id);
    if (index === -1) {
      // New request
      dispatch(addFriendRequest(request));
    } else {
      // Request already exists, update it
      dispatch(setFriendRequest({ request, index }));
    }
  };

export const AddChatroom =
  (userId: string): AppThunk =>
  async (dispatch, getState) => {
    // chatroom doesn't exist, get a new one from server
    const { chatroom } = await Request.GetChatroom(
      userId,
      getState().auth.token
    );
    dispatch(addChatroom({ ...chatroom, pinned: false }));
  };

export const SetChatroom =
  (userId: string): AppThunk =>
  async (dispatch, getState) => {
    const { chatrooms } = getState().data.conversation;
    const chatroomExists = chatrooms.find(room =>
      room.users.find(u => u._id === userId)
    );

    // chatroom already exists, just switch current target
    if (!chatroomExists) {
      // chatroom doesn't exist, get a new one from server
      const { chatroom } = await Request.GetChatroom(
        userId,
        getState().auth.token
      );
      dispatch(addChatroom({ ...chatroom, pinned: false }));
      dispatch(setCurrentChatroomId(chatroom._id));
    } else {
      dispatch(setCurrentChatroomId(chatroomExists._id));
    }
  };

export const PinChatroom =
  (chatroomId: string): AppThunk =>
  (dispatch, _getState) => {
    dispatch(pinChatroom({ chatroomId, pin: true }));
  };

export const UnpinChatroom =
  (chatroomId: string): AppThunk =>
  (dispatch, _getState) => {
    dispatch(pinChatroom({ chatroomId, pin: false }));
  };

export const AddMessage =
  (message: any): AppThunk =>
  (dispatch, getState) => {
    const { chatroomId } = message;
    const chatroomExists = getState().data.conversation.chatrooms.find(
      room => room._id === chatroomId
    );

    if (!chatroomExists) {
      dispatch(AddChatroom(message.sender._id));
    }

    dispatch(addMessage(message));
    dispatch(setLastMesasge(message));
  };
