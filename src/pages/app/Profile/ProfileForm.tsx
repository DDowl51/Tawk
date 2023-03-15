import { faker } from '@faker-js/faker';
import { Button, Form, Input, Row } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectData } from 'store/data/data.slice';

const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(selectData);

  const handleSubmit = (formValues: { name: string; about: string }) => {
    setLoading(true);
    setTimeout(() => {
      console.log(formValues);
      setLoading(false);
      toast.success('Profile updated');
    }, 2000);
  };

  return (
    <Form onFinish={handleSubmit} layout='vertical' style={{ marginTop: 36 }}>
      <Form.Item
        label='Name'
        name='name'
        extra='This name is visible to your contacts'
        rules={[{ required: true }]}
        initialValue={user?.name}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='About'
        name='about'
        rules={[{ required: true }]}
        initialValue={user?.about}
      >
        <Input.TextArea
          autoSize={{ maxRows: 5, minRows: 3 }}
          value={faker.random.words(10)}
        />
      </Form.Item>
      <Row justify='end'>
        <Button loading={loading} type='primary' htmlType='submit'>
          Update
        </Button>
      </Row>
    </Form>
  );
};

export default ProfileForm;
