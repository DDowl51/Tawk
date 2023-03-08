import Icon from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import {
  Button,
  Divider,
  Image,
  Layout,
  Row,
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
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { selectData } from 'store/data/data.slice';
import { SetChatSider, SwitchChatSider } from 'store/ui/ui.action';
import BlockDialog from './BlockDialog';
import DeleteDialog from './DeleteDialog';

const ContactInfo = () => {
  const { token } = theme.useToken();
  const dispatch = useDispatch<AppDispatch>();

  const {
    conversation: { currentChatroomId, chatrooms },
    user,
  } = useSelector(selectData);

  const currentTargetId = chatrooms
    .find(room => room._id === currentChatroomId)!
    .users.find(u => u._id !== user?._id)?._id;
  const currentTarget = user?.friends.find(f => f._id === currentTargetId);

  const [muted, setMuted] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const handleBlockCancel = () => setBlockOpen(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleDeleteCancel = () => setDeleteOpen(false);

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
              <Avatar
                size={64}
                src={currentTarget?.avatar}
                alt='Contact avatar'
              />
              <Space direction='vertical' size={1}>
                <Typography.Text
                  ellipsis={{ tooltip: faker.name.fullName() }}
                  style={{ fontSize: 16, fontWeight: 'bold', width: 180 }}
                >
                  {currentTarget?.name}
                </Typography.Text>
                <Typography.Text style={{ fontWeight: '600' }}>
                  {currentTarget?.email}
                </Typography.Text>
              </Space>
            </Row>

            {/* Audio & Video Call Row */}
            <Row style={{ width: '100%', justifyContent: 'space-evenly' }}>
              <Tooltip title='Voice' placement='bottom'>
                <Button
                  shape='circle'
                  size='large'
                  type='text'
                  icon={<Icon component={() => <Phone size={24} />} />}
                />
              </Tooltip>
              <Tooltip title='Video' placement='bottom'>
                <Button
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
                1 group in common
              </Typography.Text>
              <Row wrap={false} align='middle' style={{ gap: 16 }}>
                <Avatar src={faker.image.avatar()} alt='Contact avatar' />
                <Space direction='vertical' size={1}>
                  <Typography.Text
                    ellipsis={{ tooltip: faker.name.fullName() }}
                    style={{ fontSize: 16, fontWeight: 'bold', width: 200 }}
                  >
                    Tawk
                  </Typography.Text>
                  <Typography.Text style={{ fontWeight: '600' }}>
                    Owl, Parrot, Rabbit, You
                  </Typography.Text>
                </Space>
              </Row>
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
