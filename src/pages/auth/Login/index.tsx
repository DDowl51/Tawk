import { Space, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { PATH_AUTH } from '../../../routes/path';
import LoginForm from './LoginForm';
import AuthSocial from './AuthSocial';

const Login = () => {
  return (
    <Space direction='vertical' size={16}>
      <Typography.Title level={3}>Login to Tawk</Typography.Title>

      <Typography.Text style={{ fontWeight: 'bold' }}>
        New user? <Link to={PATH_AUTH.auth.register}>Create an account</Link>
      </Typography.Text>

      <LoginForm />

      <AuthSocial />
    </Space>
  );
};

export default Login;
