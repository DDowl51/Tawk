import { Button, Card, Col, Row, theme, Typography } from 'antd';
import { FC } from 'react';
import Avatar from 'components/Avatar';
import Icon from '@ant-design/icons/lib/components/Icon';
import { Chat } from 'phosphor-react';
import { User } from 'types';
import { useAppDispatch } from 'store';
import { SetChatroom } from 'store/data/data.action';
import { CloseFriendsDialog } from 'store/ui/ui.action';

type FriendsItemProps = {
  user: Omit<User, 'friends'>;
};

const FriendsItem: FC<FriendsItemProps> = ({ user }) => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();

  const handleAddConversation = () => {
    dispatch(SetChatroom(user._id));
    dispatch(CloseFriendsDialog());
  };

  return (
    <Card bodyStyle={{ padding: 0 }}>
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
          <Avatar src={user.avatar} online={user.online} />
        </Col>
        <Row style={{ flex: 1 }} align='middle'>
          <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1.5 }}>
            {user.name}
          </Typography.Text>
        </Row>
        <Button
          onClick={handleAddConversation}
          shape='circle'
          size='large'
          icon={<Icon component={() => <Chat size={18} />} />}
        />
      </Row>
    </Card>
  );
};

export default FriendsItem;
