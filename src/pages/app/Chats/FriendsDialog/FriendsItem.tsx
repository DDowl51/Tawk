import {
  Button,
  Card,
  Col,
  Row,
  Skeleton,
  Space,
  theme,
  Typography,
} from 'antd';
import { FC } from 'react';
import Avatar from 'components/Avatar';
import Icon from '@ant-design/icons/lib/components/Icon';
import { Chat } from 'phosphor-react';
import { useAppDispatch } from 'store';
import { SetSingleChatroom } from 'store/data/data.action';
import { CloseFriendsDialog } from 'store/ui/ui.action';
import { useGetUserByIdQuery } from 'store/services';

type FriendsItemProps = {
  userId: string;
};

const FriendsItem: FC<FriendsItemProps> = ({ userId }) => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();

  const { data: user, error, isLoading } = useGetUserByIdQuery(userId);

  const handleAddConversation = () => {
    dispatch(SetSingleChatroom(userId));
    dispatch(CloseFriendsDialog());
  };

  return (
    <Card bodyStyle={{ padding: 0 }}>
      {error ? (
        <>{error}</>
      ) : isLoading ? (
        <Skeleton avatar paragraph={{ rows: 1 }} />
      ) : user ? (
        <Row
          wrap={false}
          style={{
            backgroundColor: token.colorBgContainer,
            padding: 12,
            borderRadius: 8,
          }}
          align='middle'
        >
          <Col
            style={{ display: 'flex', alignItems: 'center', marginRight: 12 }}
          >
            <Avatar src={user.avatar} online={user.online} />
          </Col>
          <Space.Compact style={{ flex: 1 }} direction='vertical'>
            <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1.5 }}>
              {user.name}
            </Typography.Text>
            <Typography.Text
              type='secondary'
              style={{ fontWeight: '600', fontSize: 12, lineHeight: 1.5 }}
            >
              {user.email}
            </Typography.Text>
          </Space.Compact>
          <Button
            onClick={handleAddConversation}
            shape='circle'
            size='large'
            icon={<Icon component={() => <Chat size={18} />} />}
          />
        </Row>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default FriendsItem;
