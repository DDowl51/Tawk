import { AppThunk } from 'store';
import {
  Chatroom,
  FriendRequest,
  GroupChatroom,
  MessageType,
  User,
} from 'types';
import {
  addChatroom,
  addFriendRequest,
  addMessage,
  addUserFriend,
  pinChatroom,
  setCurrentGroupChatroomId,
  setCurrentSingleChatroomId,
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

export const AddChatroomFromUserId =
  (userId: string): AppThunk =>
  async (dispatch, getState) => {
    // chatroom doesn't exist, get a new one from server
    const { chatroom } = await Request.GetChatroom(
      userId,
      getState().auth.token
    );
    dispatch(addChatroom({ ...chatroom, pinned: false }));
  };

export const AddChatroom =
  (chatroom: Chatroom): AppThunk =>
  async (dispatch, _getState) => {
    dispatch(addChatroom({ ...chatroom, pinned: false }));
  };

export const SetSingleChatroom =
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
      dispatch(setCurrentSingleChatroomId(chatroom._id));
    } else {
      dispatch(setCurrentSingleChatroomId(chatroomExists._id));
    }
  };

export const SetGroupChatroom =
  (chatroom: GroupChatroom): AppThunk =>
  async (dispatch, _getState) => {
    dispatch(setCurrentGroupChatroomId(chatroom._id));
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
  (message: MessageType): AppThunk =>
  async (dispatch, getState) => {
    const { chatroomId } = message;
    const { token } = getState().auth;
    const chatroomExists = getState().data.conversation.chatrooms.find(
      room => room._id === chatroomId
    );

    if (!chatroomExists) {
      // Get the chatroom from server
      const { chatroom } = await Request.GetChatroomById(chatroomId, token);
      dispatch(AddChatroom(chatroom));
    }

    dispatch(addMessage(message));
    dispatch(setLastMesasge(message));
  };
