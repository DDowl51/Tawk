import { Row, Button, Input, Popover, Space, Tooltip } from 'antd';
import Icon, { WindowsFilled } from '@ant-design/icons';
import {
  Plus,
  Smiley,
  PaperPlaneTilt,
  Camera,
  Sticker,
  User,
  Image,
  File,
} from 'phosphor-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectSettings } from 'store/settings/settings.slice';
import { FC, useRef, useState } from 'react';
import { useAppDispatch } from 'store';
import { useSocket } from 'hooks/useSocket';
import { MessageType, ServerEvents } from 'types';
import { selectAuth } from 'store/auth/auth.slice';
import { AddMessage } from 'store/data/data.action';

const Actions = [
  {
    icon: <Image />,
    title: 'Photo/Video',
  },
  {
    icon: <Sticker />,
    title: 'Stickers',
  },
  {
    icon: <Camera />,
    title: 'Image',
  },
  {
    icon: <File />,
    title: 'Document',
  },
  {
    icon: <User />,
    title: 'Contact',
  },
];

const AttachOptions = () => {
  return (
    <Space direction='vertical'>
      {Actions.map(action => (
        <Tooltip key={action.title} placement='right' title={action.title}>
          <Button
            type='primary'
            shape='circle'
            size='large'
            icon={<Icon component={() => action.icon} />}
          />
        </Tooltip>
      ))}
    </Space>
  );
};

type ChatInputType = {
  chatroomId: string;
};

const ChatInput: FC<ChatInputType> = ({ chatroomId }) => {
  const { theme } = useSelector(selectSettings);
  const { userId } = useSelector(selectAuth);
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputEl = document.getElementById(
    'chatinput-textarea'
  )! as HTMLTextAreaElement;

  const handleSend = () => {
    if (input.trim().length === 0) {
      return toast.error('请输入消息');
    }
    let type = 'text';
    if (/^https?:\/\/(\w+).(.*)$/.test(input)) {
      type = 'link';
    }

    socket.emit(
      ServerEvents.SendMessage,
      {
        from: userId,
        text: input,
        chatroomId,
        type,
      },
      (message: MessageType) => {
        dispatch(AddMessage(message));
        console.log(message.text);
      }
    );
    setInput('');
  };

  const handleEmojiSelect = (emojiData: any) => {
    const start = inputEl.selectionStart;
    inputEl.setRangeText(emojiData.native);
    inputEl.setSelectionRange(
      start + emojiData.native.length,
      start + emojiData.native.length
    );
    inputEl.focus();
    setInput(inputEl.value);
  };

  return (
    <>
      <Row wrap={false} style={{ gap: 8 }}>
        <Popover
          color='transparent'
          content={<AttachOptions />}
          title=''
          overlayInnerStyle={{ boxShadow: 'none' }}
          destroyTooltipOnHide
        >
          <Button size='large' icon={<Icon component={() => <Plus />} />} />
        </Popover>
        <Input.TextArea
          id='chatinput-textarea'
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          size='large'
          autoSize={{ minRows: 1, maxRows: 3 }}
          onPressEnter={e => {
            e.preventDefault();
            // ctrl+enter 换行 而不是 发送消息
            if (e.ctrlKey) {
              setInput(prev => `${prev}\n`);
            } else {
              handleSend();
            }
          }}
        />
        <Popover
          mouseLeaveDelay={0.2}
          placement='topRight'
          content={
            <Picker
              data={data}
              theme={theme.mode}
              onEmojiSelect={handleEmojiSelect}
            />
          }
          autoAdjustOverflow
        >
          <Button size='large' icon={<Icon component={() => <Smiley />} />} />
        </Popover>
        <Button onClick={handleSend} type='primary' size='large'>
          Send
          <Icon component={() => <PaperPlaneTilt />} />
        </Button>
      </Row>
    </>
  );
};

export default ChatInput;
