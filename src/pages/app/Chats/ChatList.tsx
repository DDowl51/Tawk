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
import Icon from '@ant-design/icons';
import { MagnifyingGlass, ArchiveBox, Users, Plus } from 'phosphor-react';
import SimpleBarStyle from 'components/SimpleBarStyle';

import { ChatList as CHATLIST } from 'data';
import ChatListItem from './ChatListItem';
import { useState } from 'react';
import FriendsDialog from './FriendsDialog';
import AddFriendDialog from './AddFriendDialog';

const ChatList = () => {
  const [friendsOpen, setFriendsOpen] = useState(false);
  const handleFriendsCancel = () => setFriendsOpen(false);
  const [addFriendsOpen, setAddFriendsOpen] = useState(false);
  const handleAddFriendsCancel = () => setAddFriendsOpen(false);

  const { token } = theme.useToken();
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
          <Row justify='space-between' wrap={false}>
            <Typography.Title style={{ margin: 0 }} level={3}>
              Chats
            </Typography.Title>
            <Row>
              <Button
                onClick={() => setFriendsOpen(true)}
                icon={<Icon component={() => <Users />} />}
                type='text'
                size='large'
                shape='circle'
              />
              <Button
                onClick={() => setAddFriendsOpen(true)}
                icon={<Icon component={() => <Plus />} />}
                type='text'
                size='large'
                shape='circle'
              />
            </Row>
          </Row>
          <Input
            prefix={<Icon component={() => <MagnifyingGlass />} />}
            size='large'
            placeholder='Search...'
          />
          <Button
            type='text'
            size='large'
            style={{ color: token.colorPrimary, fontWeight: 'bold' }}
            icon={<Icon component={() => <ArchiveBox size={18} />} />}
          >
            Archive
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
            {/* Pinned ChatListItem */}
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
              All Message
            </Typography.Title>
            {/* All ChatListItem */}
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
      <FriendsDialog open={friendsOpen} handleCancel={handleFriendsCancel} />
      <AddFriendDialog
        open={addFriendsOpen}
        handleCancel={handleAddFriendsCancel}
      />
    </>
  );
};

export default ChatList;
