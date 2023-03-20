import { Button, Form, Input, Modal, Row, Select, Space, Spin } from 'antd';
import { useSocket } from 'hooks/useSocket';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'store';
import { AddChatroom } from 'store/data/data.action';
import { selectData } from 'store/data/data.slice';
import { useGetUserFriendsQuery } from 'store/services';
import { CloseCreateGroupDialog } from 'store/ui/ui.action';
import { selectUI } from 'store/ui/ui.slice';
import { GroupChatroom, ServerEvents } from 'types';

type FormValues = {
  groupName: string;
  members: string[];
};

const CreateGroupModal = () => {
  const [form] = Form.useForm<FormValues>();
  const socket = useSocket();
  const dispatch = useAppDispatch();

  const { data, error, isLoading } = useGetUserFriendsQuery(null);

  const [loading, setLoading] = useState(false);
  const {
    createGroupDialog: { open },
  } = useSelector(selectUI);

  const onCancel = () => dispatch(CloseCreateGroupDialog());
  const onFinish = (formValues: FormValues) => {
    console.log(formValues);
    setLoading(true);
    socket.emit(
      ServerEvents.CreateGroup,
      formValues,
      (chatroom: GroupChatroom) => {
        dispatch(AddChatroom(chatroom));
        setLoading(false);
        form.resetFields();
      }
    );
    dispatch(CloseCreateGroupDialog());
  };

  return (
    <Modal
      title='Create New Group'
      open={open}
      confirmLoading={loading}
      onCancel={onCancel}
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
          <Select
            mode='multiple'
            optionFilterProp='label'
            allowClear
            loading={isLoading}
          >
            {error ? (
              <>{error}</>
            ) : isLoading ? (
              <Spin />
            ) : data ? (
              data.map(f => (
                <Select.Option key={f._id} value={f._id} label={f.name}>
                  {f.name}
                </Select.Option>
              ))
            ) : null}
          </Select>
        </Form.Item>
        <Row justify='end'>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button loading={loading} type='primary' htmlType='submit'>
              Create
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateGroupModal;
