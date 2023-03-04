import { Layout, theme } from 'antd';

import Chat from './Chat';
import ChatList from './ChatList';

const Chats = () => {
  const { token } = theme.useToken();
  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Sider
        style={{
          backgroundColor: token.colorBgLayout,
          boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
        }}
        width={320}
      >
        <ChatList />
      </Layout.Sider>
      <Layout.Content>
        <Chat />
      </Layout.Content>
    </Layout>
  );
};

export default Chats;