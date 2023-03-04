import { Button, Form, Input, Modal, Row, Select, Space } from 'antd';
import { FC } from 'react';

type CreateGroupModalProps = {
  open: boolean;
  confirmLoading: boolean;
  handleCreate: () => Promise<void>;
  handleCancel: () => void;
};

type FormValues = {
  groupName: string;
  members: string[];
};

const CreateGroupModal: FC<CreateGroupModalProps> = ({
  open,
  confirmLoading,
  handleCancel,
  handleCreate,
}) => {
  const [form] = Form.useForm<FormValues>();

  const onFinish = async (values: FormValues) => {
    console.log(values);
    await handleCreate();
    form.resetFields();
  };

  return (
    <Modal
      title='Create New Group'
      open={open}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={onFinish} style={{ marginTop: 24 }} form={form}>
        <Form.Item
          label='Group Name'
          name='groupName'
          rules={[{ required: true, message: 'Please specify a name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Members'
          name='members'
          rules={[
            {
              type: 'array',
              required: true,
              min: 2,
              message: 'At least two members',
            },
          ]}
        >
          <Select mode='multiple'>
            <Select.Option value='red'>Red</Select.Option>
            <Select.Option value='green'>Green</Select.Option>
            <Select.Option value='blue'>Blue</Select.Option>
            <Select.Option value='red2'>Red</Select.Option>
            <Select.Option value='green3'>Green</Select.Option>
            <Select.Option value='blue4'>Blue</Select.Option>
            <Select.Option value='red5'>Red</Select.Option>
            <Select.Option value='green6'>Green</Select.Option>
            <Select.Option value='blue7'>Blue</Select.Option>
          </Select>
        </Form.Item>
        <Row justify='end'>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button loading={confirmLoading} type='primary' htmlType='submit'>
              Create
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateGroupModal;
