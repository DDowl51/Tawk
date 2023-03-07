import { theme, Card, Row, Col, Typography, Button, Dropdown } from 'antd';
import { FC } from 'react';
import { FriendRequest, ServerEvents } from 'types';
import Avatar from 'components/Avatar';
import { useSocket } from 'hooks/useSocket';
import { useAppDispatch } from 'store';
import { ReceivedFriendRequest } from 'store/data/data.action';

type RequestItemProps = {
  request: FriendRequest;
};

const actions = [
  {
    key: 'decline',
    label: 'Decline',
  },
];

const RequestItem: FC<RequestItemProps> = ({ request }) => {
  const { token } = theme.useToken();
  const socket = useSocket();
  const dispatch = useAppDispatch();

  const handleRequest = (accepted: boolean) => {
    socket.emit(
      ServerEvents.HandleFriendRequest,
      {
        requestId: request._id,
        accepted,
      },
      (request: FriendRequest) => {
        dispatch(ReceivedFriendRequest(request));
      }
    );
  };

  const handleDecline = () => {
    console.log(request._id);
    handleRequest(false);
  };

  const handleAccept = () => {
    handleRequest(true);
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
          <Avatar
            src={request.sender.avatar || ''}
            online={request.sender.online}
          />
        </Col>
        <Row style={{ flex: 1 }} align='middle'>
          <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1.5 }}>
            {request.sender.name}
          </Typography.Text>
        </Row>
        <Button.Group>
          <Dropdown.Button
            disabled={request.handled}
            type='primary'
            menu={{ items: actions, onClick: handleDecline }}
            onClick={handleAccept}
          >
            {request.handled
              ? request.accepted
                ? 'ACCEPTED'
                : 'DECLINED'
              : 'Accept'}
          </Dropdown.Button>
        </Button.Group>
      </Row>
    </Card>
  );
};

export default RequestItem;
