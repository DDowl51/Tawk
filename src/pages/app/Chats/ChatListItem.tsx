import { FC } from 'react';
import { Typography, Row, Col, theme, Button, Dropdown, Skeleton } from 'antd';
import Avatar from 'components/Avatar';
import { Chatroom } from 'types';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/auth/auth.slice';
import { useAppDispatch } from 'store';
import { dateTo } from 'utils/dayjs';
import { selectData, setCurrentSingleChatroomId } from 'store/data/data.slice';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { PinChatroom, UnpinChatroom } from 'store/data/data.action';
import { useGetUserByIdQuery } from 'store/services';

type ChatListItemProps = {
  chatroom: Chatroom;
};

const ChatListItem: FC<ChatListItemProps> = ({ chatroom }) => {
  const dispatch = useAppDispatch();
  const { userId } = useSelector(selectAuth);
  const { token } = theme.useToken();
  const {
    conversation: { currentSingleChatroomId },
  } = useSelector(selectData);
  const { users } = chatroom;
  const friendId = users.find(uId => uId !== userId)!;

  const isCurrentChatroom = currentSingleChatroomId === chatroom._id;

  const { data: friend, error, isLoading } = useGetUserByIdQuery(friendId);

  const handleSetCurrentTarget = () => {
    dispatch(setCurrentSingleChatroomId(chatroom._id));
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
      {error ? (
        <>{error}</>
      ) : isLoading ? (
        <Skeleton avatar paragraph={{ rows: 0 }} />
      ) : friend ? (
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
            flexWrap: 'nowrap',
          }}
        >
          <Col
            style={{ display: 'flex', alignItems: 'center', marginRight: 12 }}
          >
            <Avatar src={friend.avatar} online={friend.online} />
          </Col>
          <Col flex='1'>
            <Row justify='space-between'>
              <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1.5 }}>
                {friend.name}
              </Typography.Text>
              <Typography.Text type='secondary' style={{ fontWeight: 'bold' }}>
                {chatroom.lastMessage?.createdAt &&
                  dateTo(chatroom.lastMessage.createdAt)}
              </Typography.Text>
            </Row>
            <Row>
              <Typography.Text
                style={{
                  fontSize: 8,
                  margin: 0,
                  fontWeight: 'bold',
                  maxWidth: 180,
                }}
                type='secondary'
                ellipsis
              >
                {chatroom.lastMessage?.text}
              </Typography.Text>
            </Row>
          </Col>
        </Button>
      ) : null}
    </Dropdown>
  );
};

export default ChatListItem;
