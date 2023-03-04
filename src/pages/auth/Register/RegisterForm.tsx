import { Form, Input, Row, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Form noValidate size='large' onFinish={handleSubmit}>
      <Form.Item name='name' rules={[{ required: true }]}>
        <Input placeholder='Name' />
      </Form.Item>
      <Form.Item
        name='email'
        rules={[
          { required: true },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: 'Please provide valid email',
          },
        ]}
      >
        <Input placeholder='Email' type='email' />
      </Form.Item>
      <Form.Item name='password' rules={[{ required: true }]}>
        <Input.Password placeholder='Password' />
      </Form.Item>
      <Form.Item
        name='confirmPassword'
        rules={[
          form => ({
            required: true,
            validator(_, value) {
              return new Promise((resolve, reject) => {
                if (value === form.getFieldValue('password')) resolve(0);
                else reject("Password don't match!");
              });
            },
          }),
        ]}
      >
        <Input.Password placeholder='Confirm Password' />
      </Form.Item>

      <Button
        style={{ width: '100%', marginBottom: 16 }}
        type='primary'
        htmlType='submit'
      >
        Register
      </Button>

      <Row justify='center'>
        <Typography.Text
          type='secondary'
          style={{ fontSize: 12, fontWeight: 'bold' }}
        >
          By signing up, I agree to <Link to='#'>Terms of service</Link> and{' '}
          <Link to='#'>Privacy Policy</Link>
        </Typography.Text>
      </Row>
    </Form>
  );
};

export default RegisterForm;
