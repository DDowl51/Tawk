import { FC } from 'react';
import { Typography, Row, Col, theme, Button, Dropdown } from 'antd';
import Avatar from 'components/Avatar';
import { Chatroom } from 'types';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/auth/auth.slice';
import { useAppDispatch } from 'store';
import { dateTo } from 'utils/dayjs';
import { selectData, setCurrentChatroomId } from 'store/data/data.slice';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { PinChatroom, UnpinChatroom } from 'store/data/data.action';

type ChatListItemProps = {
  chatroom: Chatroom;
};

const ChatListItem: FC<ChatListItemProps> = ({ chatroom }) => {
  const dispatch = useAppDispatch();
  const { userId } = useSelector(selectAuth);
  const { token } = theme.useToken();
  const {
    conversation: { currentChatroomId },
    user,
  } = useSelector(selectData);
  const { users } = chatroom;
  const friend = users.find(u => u._id !== userId);
  const updatedFriend = user?.friends.find(f => f._id === friend?._id);

  const isCurrentChatroom = currentChatroomId === chatroom._id;

  const handleSetCurrentTarget = () => {
    dispatch(setCurrentChatroomId(chatroom._id));
  };

  const getItem = (
    label: string,
    key: string,
    icon?: React.ReactNode,
    onClick?: () => void
  ): ItemType => {
    return { label, key, icon, onClick };
  };

  const messageMenu: ItemType[] = [
    getItem(chatroom.pinned ? 'Unpin' : 'Pin', 'pin', null, () => {
      if (chatroom.pinned) {
        dispatch(UnpinChatroom(chatroom._id));
      } else {
        dispatch(PinChatroom(chatroom._id));
      }
    }),
    getItem('Delete conversation', 'delete-conversation'),
  ];

  return (
    <Dropdown menu={{ items: messageMenu }} trigger={['contextMenu']}>
      <Button
        onClick={handleSetCurrentTarget}
        style={{
          display: 'flex',
          backgroundColor: isCurrentChatroom
            ? token.colorPrimaryBg
            : token.colorBgContainer,
          padding: 12,
          borderRadius: 8,
          cursor: 'pointer',
          width: '100%',
          height: 'auto',
        }}
      >
        <Col style={{ display: 'flex', alignItems: 'center', marginRight: 12 }}>
          <Avatar src={updatedFriend!.avatar} online={updatedFriend!.online} />
        </Col>
        <Col flex='1'>
          <Row justify='space-between'>
            <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1.5 }}>
              {updatedFriend!.name}
            </Typography.Text>
            <Typography.Text type='secondary' style={{ fontWeight: 'bold' }}>
              {chatroom.lastMessage?.createdAt &&
                dateTo(chatroom.lastMessage.createdAt)}
            </Typography.Text>
          </Row>
          <Row>
            <Typography.Paragraph
              style={{ fontSize: 8, margin: 0, fontWeight: 'bold' }}
              type='secondary'
              ellipsis={{ rows: 2 }}
            >
              {chatroom.lastMessage?.text}
            </Typography.Paragraph>
          </Row>
        </Col>
      </Button>
    </Dropdown>
  );
};

export default ChatListItem;
