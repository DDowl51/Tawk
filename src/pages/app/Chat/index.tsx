import { Layout } from 'antd';

import Chat from './Chat';
import ChatList from './ChatList';

const Chats = () => {
  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Sider width={320}>
        <ChatList />
      </Layout.Sider>
      <Layout.Content>
        <Chat />
      </Layout.Content>
    </Layout>
  );
};

export default Chats;
