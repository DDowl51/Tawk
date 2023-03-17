import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';
import { CallLog, User } from 'types';

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
    getCallLogById: builder.query<CallLog, string>({
      query: callLogId => `/callLog/${callLogId}`,
      transformResponse: (response: { callLog: CallLog }) => response.callLog,
      transformErrorResponse: (response: any, meta, arg) =>
        response.data.message,
    }),
  }),
});

export const { useGetUserByIdQuery, useGetCallLogByIdQuery } = chatApi;
