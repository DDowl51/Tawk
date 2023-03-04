import { Layout, theme } from 'antd';
import GroupList from './GroupList';

const Groups = () => {
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
        <GroupList />
      </Layout.Sider>
      <Layout.Content>Groups</Layout.Content>
    </Layout>
  );
};

export default Groups;
