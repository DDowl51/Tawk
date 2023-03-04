import { Layout, theme } from 'antd';
import CallList from './CallList';

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
        <CallList />
      </Layout.Sider>
      <Layout.Content>Calls</Layout.Content>
    </Layout>
  );
};

export default Chats;
