import { FC, PropsWithChildren } from 'react';
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
  DividerMessage,
  TextMessage,
  ImgMessage,
  FileMessage,
  LinkMessage,
} from 'types';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/auth/auth.slice';

type MessageProps<MsgType extends MessageType> = {
  message: MsgType;
  enableMenu?: boolean;
  fullWidth?: boolean;
  isSender?: boolean;
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
      }}
      ellipsis={props.ellipsis}
    >
      {children}
    </Typography.Text>
  );
};

const MessageDivider: FC<{ message: DividerMessage }> = ({ message }) => {
  return (
    <Divider plain>
      <Typography.Text
        type='secondary'
        style={{ fontSize: 8, fontWeight: 'bold' }}
      >
        {message.text}
      </Typography.Text>
    </Divider>
  );
};

const getItem = (
  label: string,
  key: string,
  icon?: React.ReactNode
): ItemType => {
  return { label, key, icon };
};

const messageMenu: ItemType[] = [
  getItem('Reply', 'reply'),
  getItem('React to message', 'react-to-message'),
  getItem('Forward Message', 'forward-message'),
  getItem('Star Message', 'star-message'),
  getItem('Delete Message', 'delete-message'),
];

type MessageBodyProps = {
  isSender: boolean;
  enableMenu?: boolean;
  fullWidth?: boolean;
};

const MessageBody: FC<PropsWithChildren<MessageBodyProps>> = ({
  children,
  isSender,
  enableMenu = true,
  fullWidth = false,
}) => {
  const { token } = theme.useToken();

  return (
    <Row justify={isSender ? 'end' : 'start'}>
      <Dropdown
        menu={{ items: messageMenu }}
        trigger={enableMenu ? ['contextMenu'] : []}
      >
        <Row
          style={{
            padding: 8,
            margin: 8,
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
  );
};

const MessageText: FC<MessageProps<TextMessage>> = ({
  message,
  enableMenu,
  fullWidth,
  isSender = false,
}) => {
  const { token } = theme.useToken();

  return (
    <MessageBody
      isSender={isSender}
      enableMenu={enableMenu}
      fullWidth={fullWidth}
    >
      <Space direction='vertical'>
        {message.quote && (
          <Space
            direction='vertical'
            style={{
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
  message,
  enableMenu,
  fullWidth,
  isSender = false,
}) => {
  return (
    <MessageBody
      isSender={isSender}
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
  message,
  enableMenu,
  fullWidth,
  isSender = false,
}) => {
  const { token } = theme.useToken();

  return (
    <MessageBody
      isSender={isSender}
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
  message,
  enableMenu,
  fullWidth,
  isSender = false,
}) => {
  const { token } = theme.useToken();

  return (
    <MessageBody
      isSender={isSender}
      enableMenu={enableMenu}
      fullWidth={fullWidth}
    >
      <Space direction='vertical'>
        <Space
          direction='vertical'
          style={{
            borderRadius: 8,
            padding: 8,
            border: `1px solid ${token.colorTextQuaternary}`,
            width: 200,
          }}
        >
          <Image
            style={{ display: 'block' }}
            preview={false}
            src={message.preview}
          />
          <Typography.Link target='_blank' href={message.link} rel='noreferrer'>
            {message.link}
          </Typography.Link>
        </Space>
        <Text isSender={isSender}>{message.text}</Text>
      </Space>
    </MessageBody>
  );
};

const Message: FC<MessageProps<MessageType>> = ({
  message,
  enableMenu,
  fullWidth,
}) => {
  const { userId } = useSelector(selectAuth);
  const isSender = userId === message.sender._id;
  return (
    <>
      {(() => {
        switch (message.type) {
          case 'divider':
            return <MessageDivider message={message} />;
          default:
          case 'msg': {
            switch (message.subtype) {
              case 'text':
                return (
                  <MessageText
                    isSender={isSender}
                    message={message}
                    enableMenu={enableMenu}
                    fullWidth={fullWidth}
                  />
                );
              case 'img':
                return (
                  <MessageImage
                    isSender={isSender}
                    message={message}
                    enableMenu={enableMenu}
                    fullWidth={fullWidth}
                  />
                );
              case 'file':
                return (
                  <MessageFile
                    isSender={isSender}
                    message={message}
                    enableMenu={enableMenu}
                    fullWidth={fullWidth}
                  />
                );
              case 'link':
                return (
                  <MessageLink
                    isSender={isSender}
                    message={message}
                    enableMenu={enableMenu}
                    fullWidth={fullWidth}
                  />
                );
              default:
                return (
                  <MessageText
                    isSender={isSender}
                    message={message}
                    enableMenu={enableMenu}
                    fullWidth={fullWidth}
                  />
                );
            }
          }
        }
      })()}
    </>
  );
};

export default Message;
