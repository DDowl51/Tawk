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
  about: string;
  friends: Omit<User, 'friends'>[];
}

export interface FriendRequest extends BaseModel {
  sender: User;
  recipient: User;
  accepted: boolean;
  handled: boolean;
  requestTimes: number;
}

interface BaseChatroom extends BaseModel {
  type: 'single' | 'group';
  messages: MessageType[];
  users: User[];
  lastMessage: MessageType;
  pinned: boolean;
}

export interface SingleChatroom extends BaseChatroom {
  type: 'single';
}

export interface GroupChatroom extends BaseChatroom {
  type: 'group';
  name: string;
  owner: string;
  admins: string[];
}

export type Chatroom = SingleChatroom | GroupChatroom;

export interface BaseMessage {
  type: 'text' | 'img' | 'file' | 'link';
  createdAt: string;
  updatedAt: string;
  chatroomId: string;
  sender: User;
  isSender: boolean;
}

export interface NormalMessage extends BaseMessage {
  type: 'text' | 'img' | 'file' | 'link';
  isSender: boolean;
  text: string;
  quote?: NormalMessage;
}

export interface TextMessage extends NormalMessage {
  type: 'text';
}
export interface ImgMessage extends NormalMessage {
  type: 'img';
  img: string;
}
export interface FileMessage extends NormalMessage {
  type: 'file';
  fileinfo: { filename: string; filesize: number };
  file: string;
}
export interface LinkMessage extends NormalMessage {
  type: 'link';
  link: string;
  preview?: {
    description?: string;
    favicon?: string;
    image?: string;
    site_name?: string;
    title?: string;
    type?: string;
    url?: string;
  };
}
export type MessageType = TextMessage | ImgMessage | FileMessage | LinkMessage;

// ------------------------- Socket.IO Events -------------------------
// socket.emit(...)
export const ServerEvents = {
  Connection: 'connection',
  Disconnect: 'disconnect',
  CreateFriendRequest: 'create_friend_request',
  HandleFriendRequest: 'handle_friend_request',
  SendMessage: 'send_message',
  CreateGroup: 'create_group',
} as const;

// socket.on(...)
export const ClientEvents = {
  // Error
  Error: 'error',
  // FriendRequest
  ReceiveFriendRequest: 'receive_friend_request',
  HandleFriendRequest: 'handle_friend_request',
  NewMessage: 'new_message',
  FriendOnline: 'friend_online',
  FriendOffline: 'friend_offline',
  JoinGroup: 'join_group',
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
