import { FC } from 'react';
import { Typography, Row, Col, theme, Button } from 'antd';
import Avatar from 'components/Avatar';
import { Chatroom } from 'types';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/auth/auth.slice';
import { useAppDispatch } from 'store';
import { dateTo } from 'utils/dayjs';
import { selectData, setCurrentChatroomId } from 'store/data/data.slice';

type ChatListItemProps = {
  chatroom: Chatroom;
};

const ChatListItem: FC<ChatListItemProps> = ({ chatroom }) => {
  const { token } = theme.useToken();
  const { userId } = useSelector(selectAuth);
  const {
    conversation: { currentChatroomId },
  } = useSelector(selectData);
  const { users } = chatroom;
  const dispatch = useAppDispatch();
  const user = users.find(u => u._id !== userId);

  const isCurrentChatroom = currentChatroomId === chatroom._id;

  const handleSetCurrentTarget = () => {
    dispatch(setCurrentChatroomId(chatroom._id));
  };

  return (
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
        <Avatar src={user!.avatar} online={user!.online} />
      </Col>
      <Col flex='1'>
        <Row justify='space-between'>
          <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1.5 }}>
            {user!.name}
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
  );
};

export default ChatListItem;
