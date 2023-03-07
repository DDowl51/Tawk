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

import ChatListItem from './ChatListItem';
import { useState } from 'react';
import FriendsDialog from './FriendsDialog';
import AddFriendDialog from './AddFriendDialog';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';
import { useAppDispatch } from 'store';
import { OpenFriendsDialog } from 'store/ui/ui.action';

const ChatList = () => {
  const { conversation } = useSelector(selectData);
  const dispatch = useAppDispatch();

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
                onClick={() => dispatch(OpenFriendsDialog())}
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
          <Space direction='vertical' style={{ width: '100%' }}>
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
            {/* <Space direction='vertical' style={{ width: '100%' }} size={16}>
              {conversation.chatrooms.filter(room => room.pinned).map(user => (
                <ChatListItem key={user.id} user={user} />
              ))}
            </Space> */}
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
                {conversation.chatrooms.map(room => (
                  <ChatListItem key={room._id} chatroom={room} />
                ))}
              </Space>
            }
          </Space>
        </SimpleBarStyle>
      </Col>
      <FriendsDialog />
      <AddFriendDialog
        open={addFriendsOpen}
        handleCancel={handleAddFriendsCancel}
      />
    </>
  );
};

export default ChatList;
