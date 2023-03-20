import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';
import { CallLog, Chatroom, GroupChatroom, User } from 'types';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://192.168.0.102:5002/api/',
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).auth;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: builder => ({
    getUserById: builder.query<User, string>({
      query: userId => `/user/${userId}`,
      transformResponse: (response: { user: User }) => response.user,
      transformErrorResponse: (response: any, meta, arg) =>
        response.data.message,
    }),
    getUserFriends: builder.query<User[], null>({
      query: () => '/user/friends',
      transformResponse: (response: { friends: User[] }) => response.friends,
      transformErrorResponse: (response: any, meta, arg) =>
        response.data.message,
    }),
    getCallLogById: builder.query<CallLog, string>({
      query: callLogId => `/callLog/${callLogId}`,
      transformResponse: (response: { callLog: CallLog }) => response.callLog,
      transformErrorResponse: (response: any, meta, arg) =>
        response.data.message,
    }),
    getCommonChatrooms: builder.query<GroupChatroom[], string>({
      query: friendId => `/chatroom/common/${friendId}`,
      transformResponse: (response: { chatrooms: GroupChatroom[] }) =>
        response.chatrooms,
      transformErrorResponse: (response: any, meta, arg) =>
        response.data.message,
    }),
    getChatroom: builder.query<Chatroom, string>({
      query: chatroomId => `/chatroom/${chatroomId}`,
      transformResponse: (response: { chatroom: Chatroom }) =>
        response.chatroom,
      transformErrorResponse: (response: any, meta, arg) =>
        response.data.message,
    }),
    getGroupUsers: builder.query<{ users: User[]; admins: User[] }, string>({
      query: groupId => `/chatroom/${groupId}/users`,
      transformErrorResponse: (response: any, meta, arg) =>
        response.data.message,
    }),
    setGroupAdmins: builder.mutation<
      GroupChatroom,
      { groupId: string; admins: string[] }
    >({
      query: ({ groupId, admins }) => ({
        url: `/chatroom/${groupId}/admins`,
        method: 'PATCH',
        body: { admins },
      }),
      transformResponse: (response: { chatroom: GroupChatroom }) =>
        response.chatroom,
      transformErrorResponse: (response: any, meta, arg) => {
        throw response.data.message;
      },
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetUserFriendsQuery,
  useGetCallLogByIdQuery,
  useGetCommonChatroomsQuery,
  useGetChatroomQuery,
  useGetGroupUsersQuery,
  useSetGroupAdminsMutation,
} = chatApi;
