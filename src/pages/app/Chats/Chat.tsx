import { Layout, theme, Row, Space, Typography, Button, Divider } from 'antd';
import Icon from '@ant-design/icons';
import Avatar from 'components/Avatar';
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from 'phosphor-react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import {
  CloseMessageSider,
  OpenAudioSider,
  OpenVideoSider,
  SwitchChatSider,
} from 'store/ui/ui.action';
import ChatSider from './ChatSider';
import { selectData } from 'store/data/data.slice';
import { selectAuth } from 'store/auth/auth.slice';
import VideoChat from './VideoChat';
import { selectUI } from 'store/ui/ui.slice';
import MediaContextProvider from './context/MediaContext';
import AudioChat from './AudioChat';

const Chat = () => {
  const { token } = theme.useToken();
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector(selectAuth);
  const { messageSider } = useSelector(selectUI);
  const {
    conversation: { currentSingleChatroomId, chatrooms },
    user,
  } = useSelector(selectData);
  const chatroom = chatrooms.find(
    room => room._id === currentSingleChatroomId
  )!;
  const friend = chatroom?.users.find(u => u._id !== userId)!;
  const updatedFriend = user?.friends.find(f => f._id === friend?._id)!;

  return (
    <Layout style={{ height: '100%' }} hasSider>
      <Layout>
        <Layout.Header
          style={{
            backgroundColor: token.colorBgElevated,
            boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
            padding: 16,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Row
            justify='space-between'
            style={{ width: '100%', alignItems: 'center' }}
          >
            <Row style={{ alignItems: 'center', gap: 12 }}>
              <Avatar
                style={{ cursor: 'pointer' }}
                onClick={() => dispatch(SwitchChatSider())}
                src={updatedFriend.avatar}
                alt={updatedFriend.name}
                online={updatedFriend.online}
              />
              <Space.Compact direction='vertical' style={{ lineHeight: 1 }}>
                <Typography.Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {updatedFriend.name}
                </Typography.Text>
                <Typography.Text
                  type='secondary'
                  style={{ fontSize: 8, fontWeight: 'bold' }}
                >
                  {updatedFriend.online ? 'Online' : 'Offline'}
                </Typography.Text>
              </Space.Compact>
            </Row>
            <Row align='middle' style={{ gap: 8 }}>
              <Button
                type={
                  messageSider.open && messageSider.type === 'video'
                    ? 'primary'
                    : 'default'
                }
                shape='circle'
                icon={<Icon component={() => <VideoCamera />} />}
                onClick={() => {
                  if (messageSider.open && messageSider.type === 'video') {
                    dispatch(CloseMessageSider());
                  } else {
                    dispatch(OpenVideoSider());
                  }
                }}
              />
              <Button
                type={
                  messageSider.open && messageSider.type === 'audio'
                    ? 'primary'
                    : 'default'
                }
                shape='circle'
                onClick={() => {
                  if (messageSider.open && messageSider.type === 'audio') {
                    dispatch(CloseMessageSider());
                  } else {
                    dispatch(OpenAudioSider());
                  }
                }}
                icon={<Icon component={() => <Phone />} />}
              />
              <Button
                shape='circle'
                icon={<Icon component={() => <MagnifyingGlass />} />}
              />
              <Divider type='vertical' />
              <Button
                shape='circle'
                icon={<Icon component={() => <CaretDown />} />}
              />
            </Row>
          </Row>
        </Layout.Header>
        <Layout.Content style={{ width: '100%' }}>
          <Layout style={{ height: '100%' }}>
            {/* MessageList */}
            <Layout.Content>
              <MessageList messages={chatroom?.messages || []} />
            </Layout.Content>
            {/* Video & Audio Chat */}
            <Layout.Sider
              style={{
                backgroundColor: token.colorBgElevated,
                boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
              }}
              trigger={null}
              defaultCollapsed
              reverseArrow
              collapsed={!messageSider.open}
              collapsible
              collapsedWidth={0}
              width={messageSider.width}
            >
              {(() => {
                switch (messageSider.type) {
                  case 'video':
                    return (
                      <MediaContextProvider to={updatedFriend} type='video'>
                        <VideoChat user={updatedFriend} />
                      </MediaContextProvider>
                    );
                  case 'audio':
                    return (
                      <MediaContextProvider to={updatedFriend} type='audio'>
                        <AudioChat user={updatedFriend} />
                      </MediaContextProvider>
                    );
                }
              })()}
            </Layout.Sider>
          </Layout>
        </Layout.Content>
        <Layout.Footer
          style={{
            padding: 16,
            backgroundColor: token.colorBgContainer,
            boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
          }}
        >
          <ChatInput chatroomId={chatroom._id} />
        </Layout.Footer>
      </Layout>

      {/* Chat Sider to show contact info */}
      <ChatSider />
    </Layout>
  );
};

export default Chat;
