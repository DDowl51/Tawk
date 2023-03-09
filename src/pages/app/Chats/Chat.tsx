import { Layout, theme, Row, Space, Typography, Button, Divider } from 'antd';
import Icon from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import Avatar from 'components/Avatar';
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from 'phosphor-react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { SwitchChatSider } from 'store/ui/ui.action';
import ChatSider from './ChatSider';
import { selectData } from 'store/data/data.slice';
import { selectAuth } from 'store/auth/auth.slice';

const Chat = () => {
  const { token } = theme.useToken();
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector(selectAuth);
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
                shape='circle'
                icon={<Icon component={() => <VideoCamera />} />}
              />
              <Button
                shape='circle'
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
        <Layout.Content>
          <MessageList messages={chatroom?.messages || []} />
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
