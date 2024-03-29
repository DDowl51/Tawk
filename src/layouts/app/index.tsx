import { Layout } from 'antd';
import Sider from './Sider';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/auth/auth.slice';
import { PATH_AUTH } from 'routes/path';
import MediaToast from 'components/MediaToast';

const AppLayout = () => {
  const { authenticated } = useSelector(selectAuth);

  if (!authenticated) return <Navigate to={PATH_AUTH.auth.login} />;

  return (
    <>
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Layout.Sider width={120} theme='light' collapsible defaultCollapsed>
          <Sider />
        </Layout.Sider>
        <Layout.Content style={{ height: '100vh' }}>
          <Outlet />
        </Layout.Content>
      </Layout>

      {/* Call Toast */}
      <MediaToast />
    </>
  );
};

export default AppLayout;
