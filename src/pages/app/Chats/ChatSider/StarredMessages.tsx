import { Layout, Row, Typography, Button, theme } from 'antd';
import Icon from '@ant-design/icons';
import { CaretLeft } from 'phosphor-react';
import React from 'react';
import { SetChatSider } from 'store/ui/ui.action';
import MessageList from '../MessageList';
import { useAppDispatch } from 'store';

const StarredMessages = () => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();

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
        <Row wrap={false} align='middle' style={{ width: '100%', gap: 16 }}>
          <Button
            onClick={() => dispatch(SetChatSider(true, 'contact'))}
            shape='circle'
            icon={<Icon component={() => <CaretLeft />} />}
          />
          <Typography.Title level={5} style={{ margin: 0 }}>
            Starred Messages
          </Typography.Title>
        </Row>
      </Layout.Header>

      <Layout.Content>
        <MessageList messages={[]} enableMenu={false} />
      </Layout.Content>
    </Layout>
  );
};

export default StarredMessages;
