import { faker } from '@faker-js/faker';

const CallLogs = [
  {
    id: 0,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    time: '9:36',
    incoming: true,
    missed: false,
    online: true,
  },
  {
    id: 1,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    time: '12:02',
    incoming: true,
    missed: true,
    online: false,
  },
  {
    id: 2,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    time: '10:35',
    incoming: false,
    missed: false,
    online: true,
  },
  {
    id: 3,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    time: '04:00',
    incoming: false,
    missed: true,
    online: true,
  },
  {
    id: 4,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    time: '08:42',
    incoming: false,
    missed: true,
    online: false,
  },
  {
    id: 5,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    time: '08:42',
    incoming: false,
    missed: true,
    online: false,
  },
  {
    id: 6,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    time: '08:42',
    incoming: true,
    missed: false,
    online: false,
  },
  {
    id: 7,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    time: '08:42',
    incoming: false,
    missed: true,
    online: false,
  },
];

const MembersList = [
  {
    id: 0,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false,
  },
  {
    id: 1,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true,
  },
  {
    id: 2,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false,
  },
  {
    id: 3,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true,
  },
  {
    id: 4,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false,
  },
  {
    id: 5,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false,
  },
];

const ChatList = [
  {
    id: 0,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.random.words(10),
    time: '9:36',
    unread: 0,
    pinned: true,
    online: true,
  },
  {
    id: 1,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: '12:02',
    unread: 2,
    pinned: true,
    online: false,
  },
  {
    id: 2,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: '10:35',
    unread: 3,
    pinned: false,
    online: true,
  },
  {
    id: 3,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: '04:00',
    unread: 0,
    pinned: false,
    online: true,
  },
  {
    id: 4,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: '08:42',
    unread: 0,
    pinned: false,
    online: false,
  },
  {
    id: 5,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: '08:42',
    unread: 0,
    pinned: false,
    online: false,
  },
  {
    id: 6,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: '08:42',
    unread: 0,
    pinned: false,
    online: false,
  },
  {
    id: 7,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: '08:42',
    unread: 0,
    pinned: false,
    online: false,
  },
];

export interface BaseMessage {
  type: 'msg' | 'divider';
}

export interface DividerMessage extends BaseMessage {
  type: 'divider';
  text: string;
}

export interface NormalMessage extends BaseMessage {
  type: 'msg';
  subtype: 'text' | 'img' | 'file' | 'link';
  isSender: boolean;
  message: string;
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

const Chat_History: MessageType[] = [
  {
    type: 'msg',
    subtype: 'text',
    message: 'Hi 👋🏻, How are ya ?',
    isSender: false,
  },
  {
    type: 'divider',
    text: 'Today',
  },
  {
    type: 'msg',
    subtype: 'text',
    message: 'Hi 👋 Panda, not bad, u ?',
    isSender: true,
  },
  {
    type: 'msg',
    subtype: 'text',
    message: 'Can you send me an abstarct image?',
    isSender: true,
  },
  {
    type: 'msg',
    subtype: 'text',
    message: 'Ya sure, sending you a pic',
    isSender: false,
  },

  {
    type: 'msg',
    subtype: 'img',
    message: 'Here You Go',
    img: faker.image.abstract(),
    isSender: false,
  },
  {
    type: 'msg',
    subtype: 'text',
    message: 'Can you please send this in file format?',
    isSender: true,
  },
  {
    type: 'msg',
    subtype: 'text',
    message:
      'A very very long text test.A very very long text test.A very very long text test.A very very long textery long textery long textery long textery long textery long text test.A very very long text test.A very very long text test.A very very long text test.',
    isSender: true,
  },
  {
    type: 'msg',
    subtype: 'file',
    message: 'Yes sure, here you go.',
    file: 'Filename',
    fileinfo: { filename: 'file.txt', filesize: 12 },
    isSender: false,
  },
  {
    type: 'msg',
    subtype: 'file',
    message:
      'A very very long text test.A very very long text test.A very very long text test.A very very long textery long textery long textery long textery long textery long text test.A very very long text test.A very very long text test.A very very long text test.',
    file: 'Filename',
    fileinfo: { filename: 'file.txt', filesize: 12 },
    isSender: false,
  },
  {
    type: 'msg',
    subtype: 'link',
    preview: faker.image.cats(),
    link: 'https://www.bilibili.com',
    message: 'Yep, I can also do that',
    isSender: false,
  },
  {
    type: 'msg',
    subtype: 'text',
    quote: {
      type: 'msg',
      subtype: 'text',
      message:
        'Yep, I can also do that, Yep, I can also do that, Yep, I can also do that',
      isSender: false,
    },
    message: 'This is a reply',
    isSender: true,
  },
];

const Message_options = [
  {
    title: 'Reply',
  },
  {
    title: 'React to message',
  },
  {
    title: 'Forward message',
  },
  {
    title: 'Star message',
  },
  {
    title: 'Report',
  },
  {
    title: 'Delete Message',
  },
];

const Shared_Links = [
  {
    type: 'msg',
    subtype: 'link',
    preview: faker.image.cats(),
    message: 'Yep, I can also do that',
    incoming: true,
    outgoing: false,
  },
  {
    type: 'msg',
    subtype: 'link',
    preview: faker.image.cats(),
    message: 'Yep, I can also do that',
    incoming: true,
    outgoing: false,
  },
  {
    type: 'msg',
    subtype: 'link',
    preview: faker.image.cats(),
    message: 'Yep, I can also do that',
    incoming: true,
    outgoing: false,
  },
];

const Shared_Docs = [
  {
    type: 'msg',
    subtype: 'doc',
    message: 'Yes sure, here you go.',
    incoming: true,
    outgoing: false,
  },
  {
    type: 'msg',
    subtype: 'doc',
    message: 'Yes sure, here you go.',
    incoming: true,
    outgoing: false,
  },
  {
    type: 'msg',
    subtype: 'doc',
    message: 'Yes sure, here you go.',
    incoming: true,
    outgoing: false,
  },
];

export {
  CallLogs,
  MembersList,
  ChatList,
  Chat_History,
  Message_options,
  Shared_Links,
  Shared_Docs,
};