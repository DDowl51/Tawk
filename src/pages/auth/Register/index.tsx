import { Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { PATH_AUTH } from 'routes/path';
import AuthSocial from '../AuthSocial';
import RegisterForm from './RegisterForm';

const Register = () => {
  return (
    <Space direction='vertical' size={16}>
      <Typography.Title level={3}>Get Started With Tawk</Typography.Title>

      <Typography.Text style={{ fontWeight: 'bold' }}>
        Already have an account? <Link to={PATH_AUTH.auth.login}>Sign in</Link>
      </Typography.Text>

      <RegisterForm />

      <AuthSocial />
    </Space>
  );
};

export default Register;
