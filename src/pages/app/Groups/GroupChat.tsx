import { Layout, theme, Row, Typography, Button, Divider } from 'antd';
import Icon from '@ant-design/icons';
import Avatar from 'components/Avatar';
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from 'phosphor-react';
import ChatInput from '../Chats/ChatInput';
import MessageList from '../Chats/MessageList';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';
import { Navigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/path';

const GroupChat = () => {
  const { token } = theme.useToken();
  const {
    conversation: { currentGroupChatroomId, chatrooms },
  } = useSelector(selectData);
  const chatroom = chatrooms.find(room => room._id === currentGroupChatroomId)!;

  if (chatroom.type !== 'group') {
    return <Navigate to={PATH_DASHBOARD.app.chats} />;
  }
  return (
    <Layout style={{ height: '100%' }}>
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
            <Avatar />
            <Typography.Text style={{ fontSize: 14, fontWeight: 'bold' }}>
              {chatroom.name}
            </Typography.Text>
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
        <MessageList messages={chatroom.messages} />
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
  );
};

export default GroupChat;
