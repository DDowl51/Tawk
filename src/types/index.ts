interface BaseModel {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseModel {
  name: string;
  email: string;
  avatar?: string;
  online: boolean;
  friends: Omit<User, 'friends'>[];
}

export interface FriendRequest extends BaseModel {
  sender: User;
  recipient: User;
  accepted: boolean;
  handled: boolean;
  requestTimes: number;
}

export interface Chatroom extends BaseModel {
  name: string;
  messages: MessageType[];
  users: User[];
  lastMessage: MessageType;
}

export interface BaseMessage {
  type: 'msg' | 'divider';
  createdAt: string;
  updatedAt: string;
  chatroomId: string;
  sender: User;
  isSender: boolean;
}

export interface DividerMessage extends BaseMessage {
  type: 'divider';
  text: string;
}

export interface NormalMessage extends BaseMessage {
  type: 'msg';
  subtype: 'text' | 'img' | 'file' | 'link';
  isSender: boolean;
  text: string;
  quote?: NormalMessage;
}

export interface TextMessage extends NormalMessage {
  subtype: 'text';
}
export interface ImgMessage extends NormalMessage {
  subtype: 'img';
  img: string;
}
export interface FileMessage extends NormalMessage {
  subtype: 'file';
  fileinfo: { filename: string; filesize: number };
  file: string;
}
export interface LinkMessage extends NormalMessage {
  subtype: 'link';
  link: string;
  preview: string;
}
export type MessageType =
  | TextMessage
  | ImgMessage
  | FileMessage
  | LinkMessage
  | DividerMessage;

// ------------------------- Socket.IO Events -------------------------
// socket.emit(...)
export const ServerEvents = {
  Connection: 'connection',
  Disconnect: 'disconnect',
  CreateFriendRequest: 'create_friend_request',
  HandleFriendRequest: 'handle_friend_request',
  SendMessage: 'send_message',
} as const;

// socket.on(...)
export const ClientEvents = {
  // Error
  Error: 'error',
  // FriendRequest
  ReceiveFriendRequest: 'receive_friend_request',
  HandleFriendRequest: 'handle_friend_request',
  NewMessage: 'new_message',
} as const;

// ------------------------- Data from server -------------------------
export interface BaseReturnType {
  status: string;
  message?: string;
}

export interface LoginReturnType extends BaseReturnType {
  token: string;
  user: User;
}

export interface RegisterReturnType extends BaseReturnType {}

export interface SearchUsersReturnType extends BaseReturnType {
  users: User[];
}

export interface GetChatroomReturnType extends BaseReturnType {
  chatroom: Chatroom;
}
