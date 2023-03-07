import {
  GetChatroomReturnType,
  LoginReturnType,
  RegisterReturnType,
  SearchUsersReturnType,
} from 'types';

import axios from 'axios';

const server = axios.create({
  baseURL: 'http://localhost:5000/api',
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
  const { data } = await server.get<SearchUsersReturnType>(`/user/${query}`);
  return data;
};

export const GetChatroom = async (friendId: string, token: string) => {
  const { data } = await server.get<GetChatroomReturnType>(
    `/chatroom/${friendId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};
