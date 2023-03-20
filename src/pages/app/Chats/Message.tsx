import { FC, PropsWithChildren, useEffect } from 'react';
import {
  Row,
  Divider,
  Typography,
  theme,
  Image,
  Space,
  Button,
  Dropdown,
} from 'antd';
import type { ItemType } from 'antd/es/menu/hooks/useItems';
import Icon from '@ant-design/icons';
import { Download, File } from 'phosphor-react';
import { TextProps } from 'antd/es/typography/Text';

import findTextColor from 'utils/findTextColor';
import {
  MessageType,
  TextMessage,
  ImgMessage,
  FileMessage,
  LinkMessage,
} from 'types';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/auth/auth.slice';
import { useNavigate } from 'react-router';
import useInView from 'react-hook-inview/dist/useInView';
import { useAppDispatch } from 'store';
import React from 'react';
import { ReadMessage } from 'store/data/data.action';

type MessageProps<MsgType extends MessageType> = {
  message: MsgType;
  enableMenu?: boolean;
  fullWidth?: boolean;
  isSender?: boolean;
  style?: React.CSSProperties;
};

const Text: FC<PropsWithChildren<{ isSender: boolean } & TextProps>> = ({
  children,
  isSender,
  ...props
}) => {
  const { token } = theme.useToken();

  const textColor = findTextColor(token.colorPrimary, '#e9ecef', '#343a40');

  return (
    <Typography.Text
      style={{
        fontWeight: 'bold',
        color: isSender ? textColor : token.colorText,
        whiteSpace: 'pre-line', // 识别\n换行
      }}
      ellipsis={props.ellipsis}
      {...props}
    >
      {children}
    </Typography.Text>
  );
};

const MessageDivider: FC<{ time: string }> = ({ time }) => {
  return (
    <Divider plain>
      <Typography.Text
        type='secondary'
        style={{ fontSize: 8, fontWeight: 'bold' }}
      >
        {time}
      </Typography.Text>
    </Divider>
  );
};

const getItem = (
  label: string,
  key: string,
  icon?: React.ReactNode,
  onClick?: () => void
): ItemType => {
  return { label, key, icon, onClick };
};

const messageMenu: ItemType[] = [
  getItem('Reply', 'reply'),
  getItem('React to message', 'react-to-message'),
  getItem('Forward Message', 'forward-message'),
  getItem('Star Message', 'star-message'),
  getItem('Delete Message', 'delete-message'),
];

type MessageBodyProps = {
  message: MessageType;
  enableMenu?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
};

const MessageBody: FC<PropsWithChildren<MessageBodyProps>> = ({
  style,
  children,
  message,
  enableMenu = true,
  fullWidth = false,
}) => {
  const { token } = theme.useToken();
  const { userId } = useSelector(selectAuth);
  const isSender = message.sender._id === userId;

  const [ref, isVisible] = useInView();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isVisible && !message.read) {
      dispatch(ReadMessage(message));
    }
  }, [dispatch, isVisible, message]);

  return (
    <Row ref={ref} style={{ margin: 8, ...style, willChange: 'auto' }}>
      <Space.Compact direction='vertical' style={{ width: '100%' }}>
        {!isSender && (
          <Row justify='start'>
            <Typography.Text>{message.sender.name}</Typography.Text>
          </Row>
        )}
        <Row justify={isSender ? 'end' : 'start'}>
          <Dropdown
            menu={{ items: messageMenu }}
            trigger={enableMenu ? ['contextMenu'] : []}
          >
            <Row
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: isSender
                  ? token.colorPrimary
                  : token.colorBgElevated,
                width: fullWidth ? '100%' : undefined,
                maxWidth: fullWidth ? '100%' : '70%',
              }}
            >
              {children}
            </Row>
          </Dropdown>
        </Row>
      </Space.Compact>
    </Row>
  );
};

const MessageText: FC<MessageProps<TextMessage>> = ({
  style,
  message,
  enableMenu,
  fullWidth,
  isSender = false,
}) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  return (
    <MessageBody
      message={message}
      enableMenu={enableMenu}
      fullWidth={fullWidth}
      style={style}
    >
      <Space direction='vertical'>
        {message.quote && (
          <Space
            onClick={() => navigate(`#${message._id}`)}
            direction='vertical'
            style={{
              cursor: 'pointer',
              backgroundColor: token.colorPrimaryBgHover,
              borderRadius: 8,
              padding: 8,
              border: `1px solid ${token.colorTextQuaternary}`,
              width: 200,
            }}
          >
            <Text ellipsis={true} isSender={false}>
              {message.quote.text}
            </Text>
          </Space>
        )}
        <Text isSender={isSender}>{message.text}</Text>
      </Space>
    </MessageBody>
  );
};

const MessageImage: FC<MessageProps<ImgMessage>> = ({
  style,
  message,
  enableMenu,
  fullWidth,
  isSender = false,
}) => {
  return (
    <MessageBody
      style={style}
      message={message}
      enableMenu={enableMenu}
      fullWidth={fullWidth}
    >
      <Space direction='vertical'>
        <Image
          placeholder
          preview={{ mask: null }}
          style={{ maxHeight: 210, cursor: 'pointer' }}
          src={message.img}
        />
        <Text isSender={isSender}>{message.text}</Text>
      </Space>
    </MessageBody>
  );
};

const MessageFile: FC<MessageProps<FileMessage>> = ({
  style,
  message,
  enableMenu,
  fullWidth,
  isSender = false,
}) => {
  const { token } = theme.useToken();

  return (
    <MessageBody
      style={style}
      message={message}
      enableMenu={enableMenu}
      fullWidth={fullWidth}
    >
      <Space direction='vertical' style={{ width: '100%' }}>
        <Row
          wrap={false}
          align='middle'
          justify='space-between'
          style={{
            borderRadius: 8,
            padding: 8,
            border: `1px solid ${token.colorTextQuaternary}`,
            width: fullWidth ? '100%' : 200,
          }}
        >
          <Row style={{ gap: 8 }} align='middle' wrap={false}>
            <Icon component={() => <File size={24} />} />
            <Space.Compact direction='vertical' style={{ width: '80%' }}>
              <Typography.Text
                ellipsis={{ tooltip: message.fileinfo.filename }}
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  padding: 0,
                }}
              >
                {message.fileinfo.filename}
              </Typography.Text>
              <Typography.Text
                style={{ padding: 0, fontSize: 6, fontWeight: 'bold' }}
                type='secondary'
              >
                {message.fileinfo.filesize}kb
              </Typography.Text>
            </Space.Compact>
          </Row>
          <Button
            style={{ padding: 4 }}
            type='text'
            icon={<Icon component={() => <Download size={18} />} />}
          />
        </Row>
        <Text isSender={isSender}>{message.text}</Text>
      </Space>
    </MessageBody>
  );
};

const MessageLink: FC<MessageProps<LinkMessage>> = ({
  style,
  message,
  enableMenu,
  fullWidth,
  isSender = false,
}) => {
  console.log(message.preview);
  const favicon = message.preview?.favicon;
  const title = message.preview?.title;
  return (
    <MessageBody
      style={style}
      message={message}
      enableMenu={enableMenu}
      fullWidth={fullWidth}
    >
      <Row align='bottom' style={{ gap: 8 }}>
        <Image
          style={{ display: 'block' }}
          preview={false}
          width={18}
          src={favicon}
        />
        <Typography.Link target='_blank' href={message.link} rel='noreferrer'>
          <Text isSender={isSender} style={{ textDecoration: 'underline' }}>
            {title ?? message.link}
          </Text>
        </Typography.Link>
      </Row>
    </MessageBody>
  );
};

const Message: FC<
  MessageProps<MessageType> & {
    isDivider?: boolean;
  }
> = ({ style, message, enableMenu, fullWidth, isDivider = false }) => {
  if (isDivider) {
    return <MessageDivider time={message.text} />;
  } else {
  }
  switch (message.type) {
    case 'text':
      return (
        <MessageText
          style={style}
          message={message}
          enableMenu={enableMenu}
          fullWidth={fullWidth}
        />
      );
    case 'img':
      return (
        <MessageImage
          style={style}
          message={message}
          enableMenu={enableMenu}
          fullWidth={fullWidth}
        />
      );
    case 'file':
      return (
        <MessageFile
          style={style}
          message={message}
          enableMenu={enableMenu}
          fullWidth={fullWidth}
        />
      );
    case 'link':
      return (
        <MessageLink
          style={style}
          message={message}
          enableMenu={enableMenu}
          fullWidth={fullWidth}
        />
      );
    default:
      return (
        <MessageText
          style={style}
          message={message}
          enableMenu={enableMenu}
          fullWidth={fullWidth}
        />
      );
  }
};

export default Message;
