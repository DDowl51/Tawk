import {
  GetChatroomReturnType,
  GetFriendsReturnType,
  LoginReturnType,
  RegisterReturnType,
  SearchUsersReturnType,
} from 'types';

import axios from 'axios';

const server = axios.create({
  baseURL: 'https://192.168.0.102:5002/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  timeoutErrorMessage: 'Timeout!',
});

server.interceptors.response.use(
  response => response,
  error =>
    Promise.reject(
      (error.response && error.response.data) ||
        error.message ||
        'Something went wrong.'
    )
);

export const Login = async (email: string, password: string) => {
  const { data } = await server.post<LoginReturnType>('/auth/login', {
    email,
    password,
  });
  return data;
};

export const Register = async (
  email: string,
  name: string,
  password: string
) => {
  const { data } = await server.post<RegisterReturnType>('/auth/register', {
    email,
    password,
    name,
  });
  return data;
};

export const VerifyOTP = async (email: string, otp: string) => {
  const { data } = await server.post<LoginReturnType>('/auth/verify-otp', {
    email,
    otp,
  });
  return data;
};

export const SearchUsers = async (query: string) => {
  const { data } = await server.get<SearchUsersReturnType>(
    `/user/search/${query}`
  );
  return data;
};

export const GetChatroom = async (friendId: string, token: string) => {
  const { data } = await server.get<GetChatroomReturnType>(
    `/chatroom/userId/${friendId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const GetChatroomById = async (chatroomId: string, token: string) => {
  const { data } = await server.get<GetChatroomReturnType>(
    `/chatroom/${chatroomId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const GetFriends = async (token: string) => {
  const { data } = await server.get<GetFriendsReturnType>('/user/friends', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};
