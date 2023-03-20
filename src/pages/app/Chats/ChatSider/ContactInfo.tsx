import Icon from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import {
  Button,
  Divider,
  Image,
  Layout,
  Row,
  Skeleton,
  Space,
  Switch,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import Avatar from 'components/Avatar';
import SimpleBarStyle from 'components/SimpleBarStyle';
import {
  Bell,
  CaretRight,
  Phone,
  Prohibit,
  Star,
  Trash,
  VideoCamera,
  X,
} from 'phosphor-react';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'store';
import { selectData } from 'store/data/data.slice';
import {
  useGetCommonChatroomsQuery,
  useGetUserByIdQuery,
} from 'store/services';
import { MuteFriend, UnmuteFriend } from 'store/settings/settings.action';
import { selectSettings } from 'store/settings/settings.slice';
import {
  OpenAudioSider,
  OpenVideoSider,
  SetChatSider,
  SwitchChatSider,
} from 'store/ui/ui.action';
import { GroupChatroom } from 'types';
import BlockDialog from './BlockDialog';
import DeleteDialog from './DeleteDialog';

const Group: FC<{ group: GroupChatroom }> = ({ group }) => {
  return (
    <Row wrap={false} align='middle' style={{ gap: 16 }}>
      <Avatar alt='Contact avatar' />
      <Typography.Text
        ellipsis={{ tooltip: faker.name.fullName() }}
        style={{ fontSize: 16, fontWeight: 'bold', width: 200 }}
      >
        {group.name}
      </Typography.Text>
    </Row>
  );
};

const ContactInfo = () => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();

  const {
    conversation: { currentSingleChatroomId, chatrooms },
    user,
  } = useSelector(selectData);

  const friendId = chatrooms
    .find(room => room._id === currentSingleChatroomId)!
    .users.find(uId => uId !== user!._id)!;

  const {
    data: commonGroups,
    error: groupsError,
    isLoading: groupsLoading,
  } = useGetCommonChatroomsQuery(friendId);
  const {
    data: friend,
    error: friendError,
    isLoading: friendLoading,
  } = useGetUserByIdQuery(friendId);
  const { mutedFriends } = useSelector(selectSettings);
  const muted = mutedFriends.includes(friendId);
  const handleMute = () => {
    if (muted) {
      dispatch(UnmuteFriend(friendId));
    } else {
      dispatch(MuteFriend(friendId));
    }
  };

  const [blockOpen, setBlockOpen] = useState(false);
  const handleBlockCancel = () => setBlockOpen(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleDeleteCancel = () => setDeleteOpen(false);

  const handleAudioCall = () => {
    dispatch(OpenAudioSider());
    dispatch(SetChatSider(false, 'contact'));
  };

  const handleVideoCall = () => {
    dispatch(OpenVideoSider());
    dispatch(SetChatSider(false, 'contact'));
  };

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
            Contact Info
          </Typography.Title>
          <Button
            onClick={() => dispatch(SwitchChatSider(false))}
            shape='circle'
            icon={<Icon component={() => <X />} />}
          />
        </Row>
      </Layout.Header>

      <Layout.Content style={{ padding: 24 }}>
        <SimpleBarStyle>
          <Space direction='vertical' size={16} style={{ width: '100%' }}>
            {/* Contact Info Row */}
            <Row wrap={false} align='middle' style={{ gap: 16 }}>
              {friendError ? (
                <>{friendError}</>
              ) : friendLoading ? (
                <Skeleton avatar paragraph={{ rows: 2 }} />
              ) : friend ? (
                <>
                  <Avatar size={64} src={friend.avatar} alt='Contact avatar' />
                  <Space direction='vertical' size={1}>
                    <Typography.Text
                      ellipsis={{ tooltip: faker.name.fullName() }}
                      style={{ fontSize: 16, fontWeight: 'bold', width: 180 }}
                    >
                      {friend.name}
                    </Typography.Text>
                    <Typography.Text style={{ fontWeight: '600' }}>
                      {friend.email}
                    </Typography.Text>
                  </Space>
                </>
              ) : null}
            </Row>

            {/* Audio & Video Call Row */}
            <Row style={{ width: '100%', justifyContent: 'space-evenly' }}>
              <Tooltip title='Voice' placement='bottom'>
                <Button
                  onClick={handleAudioCall}
                  shape='circle'
                  size='large'
                  type='text'
                  icon={<Icon component={() => <Phone size={24} />} />}
                />
              </Tooltip>
              <Tooltip title='Video' placement='bottom'>
                <Button
                  onClick={handleVideoCall}
                  shape='circle'
                  size='large'
                  type='text'
                  icon={<Icon component={() => <VideoCamera size={24} />} />}
                />
              </Tooltip>
            </Row>

            {/* Divider */}
            <Divider style={{ margin: 0 }} />

            {/* About Row */}
            <Row>
              <Space direction='vertical'>
                <Typography.Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  About
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

            {/* Divider */}
            <Divider style={{ margin: 0 }} />

            {/* Shared Row */}
            <Row>
              <Space style={{ width: '100%' }} direction='vertical'>
                <Button
                  onClick={() => dispatch(SetChatSider(true, 'shared'))}
                  block
                  type='text'
                  size='large'
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: 4,
                    paddingRight: 4,
                  }}
                >
                  <Typography.Text style={{ fontWeight: 'bold' }}>
                    Media, Links & Docs
                  </Typography.Text>
                  <Row>
                    <Typography.Text style={{ fontWeight: 'bold' }}>
                      401
                    </Typography.Text>
                    <Icon component={() => <CaretRight />} />
                  </Row>
                </Button>
                <Row wrap={false} style={{ gap: 16 }}>
                  <Image preview={false} src={faker.image.abstract()} />
                  <Image preview={false} src={faker.image.abstract()} />
                  <Image preview={false} src={faker.image.abstract()} />
                </Row>
              </Space>
            </Row>

            {/* Divider */}
            <Divider style={{ margin: 0 }} />

            {/* Starred messages Row */}
            <Row>
              <Button
                onClick={() => dispatch(SetChatSider(true, 'starred'))}
                size='large'
                type='text'
                block
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: 4,
                  paddingRight: 4,
                }}
              >
                <Row style={{ gap: 8, alignItems: 'center' }}>
                  <Icon component={() => <Star size={21} />} />
                  <Typography.Text style={{ fontWeight: 'bold' }}>
                    Starred Messages
                  </Typography.Text>
                </Row>
                <Icon component={() => <CaretRight />} />
              </Button>
            </Row>

            {/* Divider */}
            <Divider style={{ margin: 0 }} />

            {/* Mute Notification Row */}
            <Row>
              <Row
                onClick={handleMute}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 4,
                  userSelect: 'none',
                }}
              >
                <Row style={{ gap: 8, alignItems: 'center' }}>
                  <Icon component={() => <Bell size={21} />} />
                  <Typography.Text style={{ fontWeight: 'bold' }}>
                    Mute Notifications
                  </Typography.Text>
                </Row>
                <Switch checked={muted} />
              </Row>
            </Row>

            {/* Divider */}
            <Divider style={{ margin: 0 }} />

            {/* Common Group Row */}
            <Row style={{ gap: 16 }}>
              <Typography.Text style={{ fontSize: 16 }}>
                {commonGroups?.length} group
                {commonGroups && commonGroups?.length >= 2 && 's'} in common
              </Typography.Text>
              {groupsError ? (
                <>{groupsError}</>
              ) : groupsLoading ? (
                <Skeleton avatar paragraph={{ rows: 0 }} />
              ) : commonGroups ? (
                commonGroups.map(g => <Group group={g} />)
              ) : null}
            </Row>

            {/* Action Row */}
            <Row wrap={false} justify='space-between' style={{ gap: 16 }}>
              <Button
                onClick={() => setBlockOpen(true)}
                size='large'
                color={token.colorWarning}
                block
                icon={<Icon component={() => <Prohibit />} />}
              >
                Block
              </Button>
              <Button
                onClick={() => setDeleteOpen(true)}
                danger
                size='large'
                block
                icon={<Icon component={() => <Trash />} />}
              >
                Delete
              </Button>
            </Row>
          </Space>
        </SimpleBarStyle>

        {/* Block Dialog */}
        <BlockDialog open={blockOpen} handleCancel={handleBlockCancel} />
        <DeleteDialog open={deleteOpen} handleCancel={handleDeleteCancel} />

        {/* Delete Dialog */}
      </Layout.Content>
    </Layout>
  );
};

export default ContactInfo;
