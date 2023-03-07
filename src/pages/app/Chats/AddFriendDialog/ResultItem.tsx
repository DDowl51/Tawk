import { Button, Row, Space, Typography } from 'antd';
import Icon from '@ant-design/icons';
import Avatar from 'components/Avatar';
import { Plus } from 'phosphor-react';
import { FC } from 'react';
import { ServerEvents, User } from 'types';
import { useAppDispatch } from 'store';
import { SetSnackbar } from 'store/ui/ui.action';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/auth/auth.slice';
import { useSocket } from 'hooks/useSocket';

type ResultItemProps = {
  user: User;
};

const ResultItem: FC<ResultItemProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { userId } = useSelector(selectAuth);
  const socket = useSocket();

  const handleSendRequest = () => {
    socket.emit(
      ServerEvents.CreateFriendRequest,
      {
        senderId: userId,
        recipientId: user._id,
      },
      // Callback
      (request: any) => {
        dispatch(SetSnackbar(true, 'success', request._id));
      }
    );
  };

  return (
    <Row
      wrap={false}
      style={{ padding: 8 }}
      align='middle'
      justify='space-between'
    >
      <Row style={{ gap: 8 }}>
        <Avatar src={user.avatar} alt={user.name} />
        <Space.Compact direction='vertical'>
          <Typography.Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {user.name}
          </Typography.Text>
          <Typography.Text style={{ fontWeight: '600', fontSize: 12 }}>
            {user.email}
          </Typography.Text>
        </Space.Compact>
      </Row>
      <Button
        disabled={userId === user._id}
        onClick={handleSendRequest}
        icon={<Icon component={() => <Plus />} />}
      />
    </Row>
  );
};

export default ResultItem;
