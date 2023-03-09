import { FC } from 'react';
import { Typography, Row, Col, theme, Button, Dropdown } from 'antd';
import Avatar from 'components/Avatar';
import { GroupChatroom } from 'types';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'store';
import { dateTo } from 'utils/dayjs';
import { selectData } from 'store/data/data.slice';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import {
  PinChatroom,
  SetGroupChatroom,
  UnpinChatroom,
} from 'store/data/data.action';

type GroupListItemProps = {
  chatroom: GroupChatroom;
};

const GroupListItem: FC<GroupListItemProps> = ({ chatroom }) => {
  const dispatch = useAppDispatch();
  const { token } = theme.useToken();
  const {
    conversation: { currentGroupChatroomId },
  } = useSelector(selectData);

  const isCurrentChatroom = currentGroupChatroomId === chatroom._id;

  const handleSetCurrentTarget = () => {
    dispatch(SetGroupChatroom(chatroom));
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
          <Avatar />
        </Col>
        <Col flex='1'>
          <Row justify='space-between' wrap={false}>
            <Typography.Text
              ellipsis={{ tooltip: chatroom.name }}
              style={{ fontWeight: 'bold', lineHeight: 1.5 }}
            >
              {chatroom.name}
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
    </Dropdown>
  );
};

export default GroupListItem;
