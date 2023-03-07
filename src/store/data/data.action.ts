import { AppThunk } from 'store';
import { FriendRequest, MessageType } from 'types';
import {
  addChatroom,
  addFriendRequest,
  addMessage,
  setCurrentChatroomId,
  setFriendRequest,
  setLastMesasge,
} from './data.slice';
import * as Request from 'requests';

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
      dispatch(addChatroom(chatroom));
      dispatch(setCurrentChatroomId(chatroom._id));
    } else {
      dispatch(setCurrentChatroomId(chatroomExists._id));
    }
  };

export const AddMessage =
  (message: MessageType): AppThunk =>
  (dispatch, getState) => {
    const { chatroomId } = message;
    const chatroomExists = getState().data.conversation.chatrooms.find(
      room => room._id === chatroomId
    );

    if (!chatroomExists) {
      dispatch(SetChatroom(message.sender._id));
    }
    dispatch(addMessage(message));
    dispatch(setLastMesasge(message));
  };
