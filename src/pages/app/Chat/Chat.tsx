import { Layout, theme, Row, Space, Typography, Button, Divider } from 'antd';
import Icon from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import Avatar from '../../../components/Avatar';
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from 'phosphor-react';
import ChatInput from './ChatInput';
import MessageList from '../../../components/MessagePanel/MessageList';

const Chat = () => {
  const { token } = theme.useToken();

  const ONLINE = Math.random() > 0.5;

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
            <Avatar src={faker.image.avatar()} alt='user' online={ONLINE} />
            <Space.Compact direction='vertical' style={{ lineHeight: 1 }}>
              <Typography.Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                {faker.name.fullName()}
              </Typography.Text>
              <Typography.Text
                type='secondary'
                style={{ fontSize: 8, fontWeight: 'bold' }}
              >
                {ONLINE ? 'Online' : 'Offline'}
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
        <MessageList />
      </Layout.Content>
      <Layout.Footer
        style={{
          padding: 16,
          backgroundColor: token.colorBgContainer,
          boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
        }}
      >
        <ChatInput />
      </Layout.Footer>
    </Layout>
  );
};

export default Chat;
