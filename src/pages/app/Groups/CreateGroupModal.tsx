import { Button, Form, Input, Modal, Row, Select, Space } from 'antd';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';

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

  const { user } = useSelector(selectData);

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
          name='name'
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
            {user?.friends.map(friend => (
              <Select.Option key={friend._id} value={friend._id}>
                {friend.name}
              </Select.Option>
            ))}
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
