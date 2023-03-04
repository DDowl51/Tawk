import { FC } from 'react';
import { Typography, Row, Col, theme } from 'antd';
import Avatar from '../../../components/Avatar';

type ChatListItemProps = {
  user: {
    id: number;
    img: string;
    name: string;
    msg: string;
    time: string;
    unread: number;
    pinned: boolean;
    online: boolean;
  };
};

const ChatListItem: FC<ChatListItemProps> = ({ user }) => {
  const { token } = theme.useToken();

  return (
    <Row
      wrap={false}
      style={{
        backgroundColor: token.colorBgContainer,
        padding: 12,
        borderRadius: 8,
      }}
    >
      <Col style={{ display: 'flex', alignItems: 'center', marginRight: 12 }}>
        <Avatar src={user.img} online={user.online} />
      </Col>
      <Col flex='1'>
        <Row justify='space-between'>
          <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1.5 }}>
            {user.name}
          </Typography.Text>
          <Typography.Text type='secondary' style={{ fontWeight: 'bold' }}>
            {user.time}
          </Typography.Text>
        </Row>
        <Row>
          <Typography.Paragraph
            style={{ fontSize: 8, margin: 0, fontWeight: 'bold' }}
            type='secondary'
            ellipsis={{ rows: 2 }}
          >
            {user.msg}
          </Typography.Paragraph>
        </Row>
      </Col>
    </Row>
  );
};

export default ChatListItem;
