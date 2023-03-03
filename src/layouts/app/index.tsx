import { Layout } from 'antd';
import Sider from './Sider';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Sider theme='light' collapsible defaultCollapsed>
        <Sider />
      </Layout.Sider>
      <Layout.Content style={{ height: '100vh' }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default AppLayout;
