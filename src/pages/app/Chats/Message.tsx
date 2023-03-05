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
} from 'data';

type MessageProps = {
  message: MessageType;
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

const MessageBody: FC<PropsWithChildren<{ isSender: boolean }>> = ({
  children,
  isSender,
}) => {
  const { token } = theme.useToken();

  return (
    <Row justify={isSender ? 'end' : 'start'}>
      <Dropdown menu={{ items: messageMenu }} trigger={['contextMenu']}>
        <Row
          style={{
            padding: 8,
            margin: 8,
            borderRadius: 8,
            backgroundColor: isSender
              ? token.colorPrimary
              : token.colorBgElevated,
            maxWidth: '70%',
          }}
        >
          {children}
        </Row>
      </Dropdown>
    </Row>
  );
};

const MessageText: FC<{ message: TextMessage }> = ({ message }) => {
  const { token } = theme.useToken();

  return (
    <MessageBody isSender={message.isSender}>
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
              {message.quote.message}
            </Text>
          </Space>
        )}
        <Text isSender={message.isSender}>{message.message}</Text>
      </Space>
    </MessageBody>
  );
};

const MessageImage: FC<{ message: ImgMessage }> = ({ message }) => {
  return (
    <MessageBody isSender={message.isSender}>
      <Space direction='vertical'>
        <Image
          placeholder
          preview={{ mask: null }}
          style={{ maxHeight: 210, cursor: 'pointer' }}
          src={message.img}
        />
        <Text isSender={message.isSender}>{message.message}</Text>
      </Space>
    </MessageBody>
  );
};

const MessageFile: FC<{ message: FileMessage }> = ({ message }) => {
  const { token } = theme.useToken();

  return (
    <MessageBody isSender={message.isSender}>
      <Space direction='vertical'>
        <Row
          align='middle'
          justify='space-between'
          style={{
            borderRadius: 8,
            padding: 8,
            border: `1px solid ${token.colorTextQuaternary}`,
            width: 200,
          }}
        >
          <Row style={{ gap: 8, marginRight: 8 }} align='middle'>
            <Icon component={() => <File size={24} />} />
            <Space.Compact direction='vertical'>
              <Typography.Text
                style={{ fontWeight: 'bold', fontSize: 16, padding: 0 }}
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
            type='text'
            icon={<Icon component={() => <Download size={18} />} />}
          />
        </Row>
        <Text isSender={message.isSender}>{message.message}</Text>
      </Space>
    </MessageBody>
  );
};

const MessageLink: FC<{ message: LinkMessage }> = ({ message }) => {
  const { token } = theme.useToken();

  return (
    <MessageBody isSender={message.isSender}>
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
          <Image preview={false} src={message.preview} />
          <Typography.Link target='_blank' href={message.link} rel='noreferrer'>
            {message.link}
          </Typography.Link>
        </Space>
        <Text isSender={message.isSender}>{message.message}</Text>
      </Space>
    </MessageBody>
  );
};

const Message: FC<MessageProps> = ({ message }) => {
  return (
    <>
      {(() => {
        switch (message.type) {
          case 'divider':
            return <MessageDivider message={message} />;
          case 'msg': {
            switch (message.subtype) {
              case 'text':
                return <MessageText message={message} />;
              case 'img':
                return <MessageImage message={message} />;
              case 'file':
                return <MessageFile message={message} />;
              case 'link':
                return <MessageLink message={message} />;
              default:
                return <MessageText message={message} />;
            }
          }
        }
      })()}
    </>
  );
};

export default Message;
