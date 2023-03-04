import { Layout, theme } from 'antd';
import SettingList from './SettingList';

const Settings = () => {
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
        <SettingList />
      </Layout.Sider>
      <Layout.Content>Settings</Layout.Content>
    </Layout>
  );
};

export default Settings;
