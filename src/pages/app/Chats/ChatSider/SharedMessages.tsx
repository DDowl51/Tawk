import {
  Layout,
  Row,
  Typography,
  Button,
  theme,
  Tabs,
  Col,
  Image,
  TabsProps,
} from 'antd';
import { CaretLeft } from 'phosphor-react';
import Icon from '@ant-design/icons';
import React, { useState } from 'react';
import { SetChatSider } from 'store/ui/ui.action';
import { useAppDispatch } from 'store';
import { faker } from '@faker-js/faker';
import Message from '../Message';
import { Shared_Docs, Shared_Links } from 'data';
import SimpleBarStyle from 'components/SimpleBarStyle';

const MediaTab = () => {
  return (
    <Row gutter={[8, 16]} style={{ width: '100%' }}>
      <Image.PreviewGroup>
        {new Array(11).fill(0).map((_, idx) => (
          <Col key={idx} span={8}>
            <Image
              style={{ cursor: 'pointer' }}
              preview={{ mask: null }}
              src={faker.image.cats()}
            />
          </Col>
        ))}
      </Image.PreviewGroup>
    </Row>
  );
};

const LinkTab = () => {
  return (
    <>
      {Shared_Links.map((msg, idx) => (
        <Message key={idx} message={msg} fullWidth enableMenu={false} />
      ))}
    </>
  );
};

const DocTab = () => {
  return (
    <>
      {Shared_Docs.map((msg, idx) => (
        <Message key={idx} message={msg} fullWidth enableMenu={false} />
      ))}
    </>
  );
};

const tabs: TabsProps['items'] = [
  { key: 'media', label: 'Media' },
  {
    key: 'link',
    label: 'Links',
  },
  { key: 'docs', label: 'Docs' },
];

const SharedMessages = () => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<string>('media');

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
            Shared Messages
          </Typography.Title>
        </Row>
      </Layout.Header>

      <Layout.Content style={{ padding: 24 }}>
        <>
          <Tabs
            centered
            items={tabs}
            onChange={activeTab => setActiveTab(activeTab)}
          />

          {/* Tab Body */}
          <SimpleBarStyle>
            {(() => {
              switch (activeTab) {
                case 'media':
                  return <MediaTab />;
                case 'link':
                  return <LinkTab />;
                case 'docs':
                  return <DocTab />;
                default:
                  return <MediaTab />;
              }
            })()}
          </SimpleBarStyle>
        </>
      </Layout.Content>

      <Layout.Footer />
    </Layout>
  );
};

export default SharedMessages;
