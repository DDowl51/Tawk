import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { VerifyOTP } from 'store/auth/auth.action';
import { selectAuth } from 'store/auth/auth.slice';

const VerifyForm = () => {
  const {
    register: { loading },
  } = useSelector(selectAuth);
  const dispatch = useDispatch<AppDispatch>();

  const submitHandler = (formValues: { otp: string }) => {
    dispatch(VerifyOTP(formValues));
  };

  return (
    <Form onFinish={submitHandler} noValidate size='large'>
      <Form.Item name='otp' rules={[{ required: true }, { len: 6 }]}>
        <Input placeholder='Your OTP' maxLength={6} minLength={6} allowClear />
      </Form.Item>

      <Button
        loading={loading}
        style={{ width: '100%' }}
        type='primary'
        htmlType='submit'
      >
        Verify
      </Button>
    </Form>
  );
};

export default VerifyForm;
