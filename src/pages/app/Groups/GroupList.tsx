import {
  Col,
  Row,
  Typography,
  theme,
  Button,
  Input,
  Space,
  Divider,
} from 'antd';
import { useState } from 'react';
import Icon from '@ant-design/icons';
import { MagnifyingGlass, Plus } from 'phosphor-react';
import SimpleBarStyle from 'components/SimpleBarStyle';

import { ChatList as CHATLIST } from 'data';
import ChatListItem from '../Chats/ChatListItem';
import CreateGroupModal from './CreateGroupModal';

const GroupList = () => {
  const { token } = theme.useToken();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreate = () => {
    setCreateLoading(true);

    return new Promise<void>(resolve => {
      setTimeout(() => {
        setCreateLoading(false);
        setCreateDialogOpen(false);
        resolve();
      }, 1000);
    });
  };
  const handleCancel = () => {
    setCreateDialogOpen(false);
  };

  return (
    <>
      <Col
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          height: '100%',
          width: 320,
        }}
      >
        <Space size={16} direction='vertical' style={{ width: '100%' }}>
          <Typography.Title style={{ margin: 0 }} level={3}>
            Groups
          </Typography.Title>
          <Input
            prefix={<Icon component={() => <MagnifyingGlass />} />}
            size='large'
            placeholder='Search...'
          />
          <Button
            type='text'
            size='large'
            style={{
              width: '100%',
            }}
            onClick={() => setCreateDialogOpen(true)}
          >
            <Row justify='space-between'>
              <Typography.Text
                style={{ color: token.colorPrimary, fontWeight: 'bold' }}
              >
                Create New Group
              </Typography.Text>
              <Icon
                style={{ color: token.colorPrimary }}
                component={() => <Plus size={18} />}
              />
            </Row>
          </Button>
        </Space>
        <Divider style={{ margin: 0, marginTop: 8 }} />
        <SimpleBarStyle
          style={{ height: '100%', overflow: 'auto', color: 'white' }}
        >
          <Space direction='vertical'>
            <Typography.Title
              type='secondary'
              style={{
                fontWeight: 'bold',
                marginTop: 8,
                userSelect: 'none',
                fontSize: 12,
              }}
              level={5}
            >
              Pinned
            </Typography.Title>
            {/* Pinned Groups */}
            <Space direction='vertical' style={{ width: '100%' }} size={16}>
              {CHATLIST.filter(user => user.pinned).map(user => (
                <ChatListItem key={user.id} user={user} />
              ))}
            </Space>
            <Typography.Title
              type='secondary'
              style={{
                fontWeight: 'bold',
                marginTop: 8,
                userSelect: 'none',
                fontSize: 12,
              }}
              level={5}
            >
              All Group
            </Typography.Title>
            {/* All Groups */}
            {
              <Space direction='vertical' style={{ width: '100%' }} size={16}>
                {CHATLIST.filter(user => !user.pinned).map(user => (
                  <ChatListItem key={user.id} user={user} />
                ))}
              </Space>
            }
          </Space>
        </SimpleBarStyle>
      </Col>

      {/* Create New Group Popup */}
      <CreateGroupModal
        open={createDialogOpen}
        confirmLoading={createLoading}
        handleCreate={handleCreate}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default GroupList;
