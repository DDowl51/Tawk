import {
  Col,
  Row,
  Typography,
  theme,
  Button,
  Input,
  Space,
  Divider,
  Skeleton,
} from 'antd';
import Icon from '@ant-design/icons';
import { MagnifyingGlass, ArchiveBox, Users, Plus } from 'phosphor-react';
import SimpleBarStyle from 'components/SimpleBarStyle';

import ChatListItem from './ChatListItem';
import { useMemo, useState } from 'react';
import FriendsDialog from './FriendsDialog';
import AddFriendDialog from './AddFriendDialog';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';
import { useAppDispatch } from 'store';
import { OpenFriendsDialog } from 'store/ui/ui.action';
import dayjs from 'dayjs';

const ChatList = () => {
  const { conversation } = useSelector(selectData);
  const dispatch = useAppDispatch();
  const sortedChatrooms = useMemo(() => {
    const chatrooms = [...conversation.chatrooms].filter(
      room => room.type === 'single'
    );
    return chatrooms.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) {
        return 0;
      } else {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
      }
      return dayjs(b.lastMessage.createdAt).diff(a.lastMessage.createdAt);
    });
  }, [conversation.chatrooms]);

  const pinnedChatrooms = useMemo(
    () => sortedChatrooms.filter(room => room.pinned),
    [sortedChatrooms]
  );
  const unpinnedChatrooms = useMemo(
    () => sortedChatrooms.filter(room => !room.pinned),
    [sortedChatrooms]
  );

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
            {pinnedChatrooms.length !== 0 && (
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
            )}
            {/* Pinned ChatListItem */}
            <Space direction='vertical' style={{ width: '100%' }} size={16}>
              {pinnedChatrooms.map(room => (
                <ChatListItem key={room._id} chatroom={room} />
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
                {unpinnedChatrooms.map(room => (
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
