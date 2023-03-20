import { faker } from '@faker-js/faker';
import { Col, Row, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

import Avatar from 'components/Avatar';
import {
  Bell,
  Image,
  Info,
  Key,
  Keyboard,
  Lock,
  Note,
  PencilSimple,
} from 'phosphor-react';
import { useCallback, useMemo, useState } from 'react';
import ThemeModal from './ThemeModal';
import ShortcutModal from './ShortcutModal';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/path';

type MenuItem = Required<MenuProps>['items'][number];

const SettingList = () => {
  const [themeOpen, setThemeOpen] = useState(false);
  const [shortcutOpen, setShortcutOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useSelector(selectData);

  const getItem = useCallback(
    (
      label: React.ReactNode,
      key: React.Key,
      icon?: React.ReactNode,
      path?: string
    ): MenuItem => {
      return {
        key,
        icon,
        label: (
          <Typography.Text style={{ fontWeight: 'bold', userSelect: 'none' }}>
            {label}
          </Typography.Text>
        ),
        onClick: path ? () => navigate(path) : undefined,
      };
    },
    [navigate]
  );

  const handleThemeOpen = () => {
    setThemeOpen(true);
  };
  const handleThemeClose = () => {
    setThemeOpen(false);
  };

  const handleShortcutOpen = () => {
    setShortcutOpen(true);
  };
  const handleShortcutClose = () => {
    setShortcutOpen(false);
  };

  const items = useMemo<MenuItem[]>(() => {
    return [
      getItem(
        'Notification',
        'notification',
        <Bell size={20} />,
        PATH_DASHBOARD.app.settings.notification
      ),
      getItem(
        'Privacy',
        'privacy',
        <Lock size={20} />,
        PATH_DASHBOARD.app.settings.privacy
      ),
      getItem(
        'Security',
        'security',
        <Key size={20} />,
        PATH_DASHBOARD.app.settings.security
      ),
      getItem(
        'Theme',
        'theme',
        <PencilSimple size={20} />,
        PATH_DASHBOARD.app.settings.theme
      ),
      getItem('Chat Wallpaper', 'chat-wallpaper', <Image size={20} />),
      getItem(
        'Request Account Info',
        'request-accountinfo',
        <Note size={20} />
      ),
      getItem(
        'Keyboard Shortcuts',
        'keyboard-shortcuts',
        <Keyboard size={20} />,
        PATH_DASHBOARD.app.settings.keyboardShortcuts
      ),
      getItem('Help', 'help', <Info size={20} />),
    ];
  }, [getItem]);

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
        <Typography.Title style={{ margin: 0 }} level={3}>
          Settings
        </Typography.Title>

        <Row
          style={{ gap: 16, marginTop: 36, marginBottom: 24 }}
          wrap={false}
          align='middle'
        >
          <Avatar size={64} src={user?.avatar} />
          <Space direction='vertical' size={1}>
            <Typography.Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {user?.name}
            </Typography.Text>
            <Typography.Paragraph
              ellipsis={{ rows: 2 }}
              style={{
                padding: 0,
                margin: 0,
                fontWeight: '600',
                fontSize: 12,
              }}
            >
              {faker.random.words(20)}
            </Typography.Paragraph>
          </Space>
        </Row>

        <Menu
          style={{ backgroundColor: 'transparent', width: '100%' }}
          items={items}
          mode='inline'
          selectable={false}
        />
      </Col>

      <ThemeModal open={themeOpen} handleCancel={handleThemeClose} />
      <ShortcutModal open={shortcutOpen} handleCancel={handleShortcutClose} />
    </>
  );
};

export default SettingList;
