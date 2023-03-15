import { Button, Row, Space, Typography } from 'antd';
import Icon from '@ant-design/icons';
import Avatar from 'components/Avatar';
import { Plus } from 'phosphor-react';
import { FC } from 'react';
import { FriendRequest, ServerEvents, User } from 'types';
import { useAppDispatch } from 'store';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/auth/auth.slice';
import { useSocket } from 'hooks/useSocket';
import { AddUserFriend } from 'store/data/data.action';

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
      (request: FriendRequest) => {
        toast.success(request._id);
        dispatch(AddUserFriend(request.sender));
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
        <Avatar src={user.avatar} alt={user.name} online={user.online} />
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
