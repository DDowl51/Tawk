import {
  Col,
  Row,
  Typography,
  theme,
  Button,
  Input,
  Space,
  Divider,
} from 'antd';
import { useMemo } from 'react';
import Icon from '@ant-design/icons';
import { MagnifyingGlass, Plus } from 'phosphor-react';
import SimpleBarStyle from 'components/SimpleBarStyle';

import CreateGroupModal from './CreateGroupModal';
import { useAppDispatch } from 'store';
import { OpenCreateGroupDialog } from 'store/ui/ui.action';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';
import dayjs from 'dayjs';
import GroupListItem from './GroupListItem';
import { GroupChatroom } from 'types';

const GroupList = () => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();

  const {
    conversation: { chatrooms },
  } = useSelector(selectData);
  const groupChatrooms = useMemo<GroupChatroom[]>(() => {
    const groupChatrooms = chatrooms.filter(
      room => room.type === 'group'
    ) as GroupChatroom[];
    return groupChatrooms.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) {
        return 0;
      } else {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
      }
      return dayjs(b.lastMessage.createdAt).diff(a.lastMessage.createdAt);
    });
  }, [chatrooms]);
  const pinnedGroupChatrooms = groupChatrooms.filter(room => room.pinned);
  const unpinnedGroupChatrooms = groupChatrooms.filter(room => !room.pinned);

  return (
    <>
      <Col
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          height: '100%',
          width: 320,
        }}
      >
        <Space size={16} direction='vertical' style={{ width: '100%' }}>
          <Typography.Title style={{ margin: 0 }} level={3}>
            Groups
          </Typography.Title>
          <Input
            prefix={<Icon component={() => <MagnifyingGlass />} />}
            size='large'
            placeholder='Search...'
          />
          <Button
            type='text'
            size='large'
            style={{
              width: '100%',
            }}
            onClick={() => dispatch(OpenCreateGroupDialog())}
          >
            <Row justify='space-between'>
              <Typography.Text
                style={{ color: token.colorPrimary, fontWeight: 'bold' }}
              >
                Create New Group
              </Typography.Text>
              <Icon
                style={{ color: token.colorPrimary }}
                component={() => <Plus size={18} />}
              />
            </Row>
          </Button>
        </Space>
        <Divider style={{ margin: 0, marginTop: 8 }} />
        <SimpleBarStyle
          style={{
            height: '100%',
            overflow: 'auto',
            color: 'white',
          }}
        >
          <Space
            direction='vertical'
            style={{
              width: '100%',
            }}
          >
            {/* Pinned Groups */}
            {pinnedGroupChatrooms.length !== 0 && (
              <Typography.Title
                type='secondary'
                style={{
                  fontWeight: 'bold',
                  marginTop: 8,
                  userSelect: 'none',
                  fontSize: 12,
                }}
                level={5}
              >
                Pinned
              </Typography.Title>
            )}
            <Space direction='vertical' style={{ width: '100%' }} size={16}>
              {pinnedGroupChatrooms.map(room => (
                <GroupListItem key={room._id} chatroom={room} />
              ))}
            </Space>
            {/* All Groups */}
            <Typography.Title
              type='secondary'
              style={{
                fontWeight: 'bold',
                marginTop: 8,
                userSelect: 'none',
                fontSize: 12,
              }}
              level={5}
            >
              All Group
            </Typography.Title>
            {
              <Space direction='vertical' style={{ width: '100%' }} size={16}>
                {unpinnedGroupChatrooms.map(room => (
                  <GroupListItem key={room._id} chatroom={room} />
                ))}
              </Space>
            }
          </Space>
        </SimpleBarStyle>
      </Col>

      {/* Create New Group Popup */}
      <CreateGroupModal />
    </>
  );
};

export default GroupList;
