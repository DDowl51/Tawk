import { Button, Form, Input, Row, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch } from 'store';
import { PATH_AUTH } from 'routes/path';
import { Login } from 'store/auth/auth.action';
import { selectAuth } from 'store/auth/auth.slice';

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    login: { loading },
  } = useSelector(selectAuth);

  const handleSubmit = (values: { email: string; password: string }) => {
    dispatch(Login(values));
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

      <Button
        loading={loading}
        style={{ width: '100%' }}
        type='primary'
        htmlType='submit'
      >
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
