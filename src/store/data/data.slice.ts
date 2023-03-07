import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chatroom, FriendRequest, MessageType, User } from 'types';
import { RootState } from '..';

export interface DataState {
  user: User | null;
  friendRequests: FriendRequest[];
  conversation: {
    currentChatroomId: string | null;
    chatrooms: Chatroom[];
  };
}

const initialState: DataState = {
  user: null,
  friendRequests: [],
  conversation: {
    currentChatroomId: null,
    chatrooms: [],
  },
};

const slice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // -- User
    setUser(state, action: PayloadAction<typeof initialState.user>) {
      state.user = action.payload;
    },
    // -- FriendRequest
    addFriendRequest(
      state,
      action: PayloadAction<typeof initialState.friendRequests[number]>
    ) {
      state.friendRequests.push(action.payload);
    },
    setFriendRequest(
      state,
      action: PayloadAction<{ index: number; request: FriendRequest }>
    ) {
      const { index, request } = action.payload;
      if (index < 0 || index >= state.friendRequests.length) return;
      state.friendRequests[index] = request;
    },
    clearFriendRequest(state) {
      state.friendRequests = [];
    },

    // -- Conversation
    setCurrentChatroomId(state, action: PayloadAction<string>) {
      state.conversation.currentChatroomId = action.payload;
    },
    setChatrooms(state, action: PayloadAction<Chatroom[]>) {
      state.conversation.chatrooms = action.payload;
    },
    setLastMesasge(state, action: PayloadAction<MessageType>) {
      const chatroom = state.conversation.chatrooms.find(
        room => room._id === action.payload.chatroomId
      );
      if (chatroom) {
        chatroom.lastMessage = action.payload;
      }
    },
    addChatroom(state, action: PayloadAction<Chatroom>) {
      state.conversation.chatrooms.unshift(action.payload);
    },
    addMessage(state, action: PayloadAction<MessageType>) {
      const chatroom = state.conversation.chatrooms.find(
        room => room._id === action.payload.chatroomId
      );
      chatroom?.messages.push(action.payload);
    },
  },
});

export const selectData = (state: RootState) => state.data;
export const {
  addFriendRequest,
  setFriendRequest,
  clearFriendRequest,
  setUser,
  setCurrentChatroomId,
  setChatrooms,
  setLastMesasge,
  addChatroom,
  addMessage,
} = slice.actions;
export default slice.reducer;
