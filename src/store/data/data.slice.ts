import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chatroom, FriendRequest, MessageType, User } from 'types';
import { RootState } from '..';

export interface DataState {
  user: User | null;
  friendRequests: FriendRequest[];
  conversation: {
    currentSingleChatroomId: string | null;
    currentGroupChatroomId: string | null;
    chatrooms: Chatroom[];
  };
  onlineFriends: string[];
}

const initialState: DataState = {
  user: null,
  friendRequests: [],
  conversation: {
    currentSingleChatroomId: null,
    currentGroupChatroomId: null,
    chatrooms: [],
  },
  onlineFriends: [],
};

const slice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // -- User
    setUser(state, action: PayloadAction<typeof initialState.user>) {
      state.user = action.payload;
    },
    addUserFriend(state, action: PayloadAction<string>) {
      if (!state.user) return;
      state.user.friends.push(action.payload);
    },
    setFriendOnline(state, action: PayloadAction<string>) {
      if (state.onlineFriends.find(id => id === action.payload)) return;
      else state.onlineFriends.push(action.payload);
    },
    setFriendOffline(state, action: PayloadAction<string>) {
      if (!state.onlineFriends.find(id => id === action.payload)) return;
      else
        state.onlineFriends = state.onlineFriends.filter(
          id => id !== action.payload
        );
    },
    addCallLog(state, action: PayloadAction<string>) {
      state.user?.callLogs.push(action.payload);
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
    setCurrentSingleChatroomId(state, action: PayloadAction<string>) {
      state.conversation.currentSingleChatroomId = action.payload;
    },
    setCurrentGroupChatroomId(state, action: PayloadAction<string>) {
      state.conversation.currentGroupChatroomId = action.payload;
    },
    setChatrooms(state, action: PayloadAction<Chatroom[]>) {
      state.conversation.chatrooms = action.payload;
    },
    pinChatroom(
      state,
      action: PayloadAction<{ chatroomId: string; pin: boolean }>
    ) {
      state.conversation.chatrooms = state.conversation.chatrooms.map(room => {
        if (room._id === action.payload.chatroomId) {
          return { ...room, pinned: action.payload.pin };
        } else return room;
      });
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
    readMessage(state, action: PayloadAction<MessageType>) {
      const chatroom = state.conversation.chatrooms.find(
        room => room._id === action.payload.chatroomId
      )!;
      const message = chatroom.messages.find(
        msg => msg._id === action.payload._id
      );
      if (message) message.read = true;
    },
  },
});

export const selectData = (state: RootState) => state.data;
export const {
  addFriendRequest,
  setFriendRequest,
  clearFriendRequest,
  setUser,
  addUserFriend,
  setFriendOnline,
  setFriendOffline,
  addCallLog,
  setCurrentSingleChatroomId,
  setCurrentGroupChatroomId,
  setChatrooms,
  pinChatroom,
  setLastMesasge,
  addChatroom,
  addMessage,
  readMessage,
} = slice.actions;
export default slice.reducer;
