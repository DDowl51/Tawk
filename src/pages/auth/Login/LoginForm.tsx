import { Button, Form, Input, Row, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { PATH_AUTH } from '../../../routes/path';

const LoginForm = () => {
  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Form size='large' onFinish={handleSubmit}>
      <Form.Item name='email' rules={[{ required: true }]}>
        <Input placeholder='Email' type='email' />
      </Form.Item>
      <Form.Item name='password' rules={[{ required: true }]}>
        <Input.Password placeholder='Password' />
      </Form.Item>

      <Row justify='end' style={{ marginBottom: 24 }}>
        <Typography.Text style={{ fontWeight: 'bold' }}>
          <Link to={PATH_AUTH.auth.resetPassword}>Forgot password?</Link>
        </Typography.Text>
      </Row>

      <Button style={{ width: '100%' }} type='primary' htmlType='submit'>
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
