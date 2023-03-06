import { Button, Col, Row, theme, Typography } from 'antd';
import { FC } from 'react';
import Avatar from 'components/Avatar';
import Icon from '@ant-design/icons/lib/components/Icon';
import { Chat } from 'phosphor-react';

type FriendsItemProps = {
  user: any;
};

const FriendsItem: FC<FriendsItemProps> = ({ user }) => {
  const { token } = theme.useToken();

  return (
    <Row
      wrap={false}
      style={{
        backgroundColor: token.colorBgContainer,
        padding: 12,
        borderRadius: 8,
      }}
      align='middle'
    >
      <Col style={{ display: 'flex', alignItems: 'center', marginRight: 12 }}>
        <Avatar src={user.img} online={user.online} />
      </Col>
      <Row style={{ flex: 1 }} align='middle'>
        <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1.5 }}>
          {user.name}
        </Typography.Text>
      </Row>
      <Button
        shape='circle'
        size='large'
        icon={<Icon component={() => <Chat size={18} />} />}
      />
    </Row>
  );
};

export default FriendsItem;
