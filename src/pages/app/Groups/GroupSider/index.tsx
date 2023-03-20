import Icon from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import {
  Button,
  Divider,
  Layout,
  List,
  Row,
  Skeleton,
  Space,
  Switch,
  theme,
  Typography,
} from 'antd';
import Avatar from 'components/Avatar';
import SimpleBarStyle from 'components/SimpleBarStyle';
import {
  ArrowClockwise,
  Bell,
  File,
  Image,
  Link,
  Plus,
  Users,
  X,
} from 'phosphor-react';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'store';
import { selectAuth } from 'store/auth/auth.slice';
import { selectData } from 'store/data/data.slice';
import { useGetChatroomQuery } from 'store/services';
import {
  OpenAddAdminModal,
  SwitchChatSider,
  SwitchGroupSider,
} from 'store/ui/ui.action';
import { GroupChatroom } from 'types';
import AddAdminModal from './AddAdminModal';
import AdminInfo from './AdminInfo';

const GroupSider = () => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();
  const {
    conversation: { currentGroupChatroomId },
  } = useSelector(selectData);
  const { userId } = useSelector(selectAuth);

  const [muted, setMuted] = useState(false);

  const { data, isLoading, refetch } = useGetChatroomQuery(
    currentGroupChatroomId!
  );
  const group = data as GroupChatroom;

  const isAdmin = useMemo(() => {
    if (group) {
      return group.admins.includes(userId) || group.owner === userId;
    }
    return false;
  }, [group, userId]);

  return (
    <Layout
      style={{
        width: 320,
        height: '100%',
      }}
    >
      <Layout.Header
        style={{
          backgroundColor: token.colorBgElevated,
          boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
          padding: 16,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Row
          wrap={false}
          justify='space-between'
          align='middle'
          style={{ width: '100%' }}
        >
          <Typography.Title level={5} style={{ margin: 0 }}>
            Group Info
          </Typography.Title>
          <Button
            onClick={() => dispatch(SwitchGroupSider(false))}
            shape='circle'
            icon={<Icon component={() => <X />} />}
          />
        </Row>
      </Layout.Header>

      <Layout.Content style={{ padding: 24 }}>
        <SimpleBarStyle>
          <Space direction='vertical' size={16} style={{ width: '100%' }}>
            {/* Group info */}
            <Row wrap={false} align='middle' style={{ gap: 16 }}>
              {isLoading ? (
                <Skeleton avatar paragraph={{ rows: 0 }} />
              ) : group ? (
                <>
                  <Avatar size={64} alt='group avatar' />
                  <Space direction='vertical' size={1}>
                    <Typography.Text
                      ellipsis={{ tooltip: faker.name.fullName() }}
                      style={{ fontSize: 16, fontWeight: 'bold', width: 180 }}
                    >
                      {group.name}
                    </Typography.Text>
                    <Typography.Text style={{ fontWeight: '600' }}>
                      {group.users.length} members
                    </Typography.Text>
                  </Space>
                </>
              ) : null}
            </Row>

            <Divider style={{ margin: 0 }} />

            {/* Notification Row */}
            <Row>
              <Space direction='vertical'>
                <Typography.Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Description
                </Typography.Text>
                <Typography.Paragraph
                  ellipsis={{ expandable: true, rows: 3 }}
                  style={{ fontWeight: '600' }}
                >
                  Hi there, I'm using Tawk!Hi there, I'm using Tawk!Hi there,
                  I'm using Tawk!Hi there, I'm using Tawk!Hi there, I'm using
                  Tawk!
                </Typography.Paragraph>
              </Space>
            </Row>
            <Row>
              <Row
                onClick={() => setMuted(prev => !prev)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 4,
                  userSelect: 'none',
                }}
              >
                <Row style={{ flex: 1, gap: 16, alignItems: 'center' }}>
                  <Icon component={() => <Bell size={21} />} />
                  <Typography.Text style={{ fontWeight: 'bold' }}>
                    Mute Notifications
                  </Typography.Text>
                </Row>
                <Switch checked={muted} />
              </Row>
            </Row>

            <Divider style={{ margin: 0 }} />

            {/* Media resources row */}
            <Space size={1} direction='vertical' style={{ width: '100%' }}>
              <Button
                type='text'
                block
                icon={<Icon component={() => <Image size={21} />} />}
                style={{
                  display: 'flex',
                  justifyContent: 'start',
                  padding: 4,
                  gap: 8,
                }}
              >
                <Typography.Text style={{ fontWeight: 'bold' }}>
                  69 photos
                </Typography.Text>
              </Button>
              <Button
                type='text'
                block
                icon={<Icon component={() => <File size={21} />} />}
                style={{
                  display: 'flex',
                  justifyContent: 'start',
                  padding: 4,
                  gap: 8,
                }}
              >
                <Typography.Text style={{ fontWeight: 'bold' }}>
                  2049 files
                </Typography.Text>
              </Button>
              <Button
                type='text'
                block
                icon={<Icon component={() => <Link size={21} />} />}
                style={{
                  display: 'flex',
                  justifyContent: 'start',
                  padding: 4,
                  gap: 8,
                }}
              >
                <Typography.Text style={{ fontWeight: 'bold' }}>
                  104 shared links
                </Typography.Text>
              </Button>
            </Space>

            <Divider style={{ margin: 0 }} />

            {/* Admin rows */}
            <Space direction='vertical' style={{ width: '100%' }}>
              <Row style={{ padding: 4 }} align='middle'>
                <Row style={{ gap: 16, flex: 1 }} align='middle'>
                  <Icon component={() => <Users size={21} />} />
                  <Typography.Text style={{ fontWeight: 'bold' }}>
                    ADMINISTRATORS
                  </Typography.Text>
                </Row>
                <Button
                  onClick={refetch}
                  shape='circle'
                  icon={<Icon component={() => <ArrowClockwise />} />}
                />
              </Row>
              <SimpleBarStyle style={{ minHeight: 166, maxHeight: 300 }}>
                {group && (
                  <List
                    dataSource={group.admins}
                    renderItem={id => <AdminInfo userId={id} />}
                  />
                )}
              </SimpleBarStyle>
              {isAdmin && (
                <>
                  <Button
                    onClick={() => dispatch(OpenAddAdminModal())}
                    block
                    type='dashed'
                    icon={<Icon component={() => <Plus />} />}
                    style={{ marginTop: 12 }}
                  >
                    Add or remove
                  </Button>
                  <AddAdminModal />
                </>
              )}
            </Space>
          </Space>
        </SimpleBarStyle>
      </Layout.Content>
    </Layout>
  );
};

export default GroupSider;
