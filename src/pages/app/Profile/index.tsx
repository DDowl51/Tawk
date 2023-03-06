import { Layout, theme } from 'antd';
import ProfileDetail from './ProfileDetail';

const Profile = () => {
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
        <ProfileDetail />
      </Layout.Sider>
      <Layout.Content>ProfilePage</Layout.Content>
    </Layout>
  );
};

export default Profile;
