export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  online: boolean;
}

// ------------------------- Socket.IO Events -------------------------
// socket.emit(...)
export const ServerEvents = {
  Connection: 'connection',
  Disconnect: 'disconnect',
  CreateFriendRequest: 'create_friend_request',
} as const;

// socket.on(...)
export const ClientEvents = {
  // Error
  Error: 'error',
  // FriendRequest
  ReceiveFriendRequest: 'receive_friend_request',
  SentFriendRequest: 'sent_friend_request',
} as const;

// ------------------------- Data from server -------------------------
export interface BaseReturnType {
  status: string;
  message?: string;
}

export interface LoginReturnType extends BaseReturnType {
  token: string;
  userId: string;
}

export interface RegisterReturnType extends BaseReturnType {}

export interface SearchUsersReturnType extends BaseReturnType {
  users: User[];
}
