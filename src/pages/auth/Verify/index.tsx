import { Space, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/path';
import { selectAuth } from 'store/auth/auth.slice';
import VerifyForm from './VerifyForm';

const Verify = () => {
  const {
    register: { verifyingEmail },
    authenticated,
  } = useSelector(selectAuth);

  if (authenticated) return <Navigate to={PATH_DASHBOARD.app.chats} />;

  return (
    <Space direction='vertical' size={16}>
      <Typography.Title level={3}>Please Verify OTP</Typography.Title>

      <Typography.Text style={{ fontWeight: 'bold' }}>
        Sent to email ({verifyingEmail})
      </Typography.Text>

      <VerifyForm />
    </Space>
  );
};

export default Verify;
