import React from 'react';
import { Menu, Col, Row, Image, theme, Avatar, Switch, Space } from 'antd';
import type { MenuProps } from 'antd';
import { ChatCircleDots, Users, Phone, GearSix } from 'phosphor-react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router';

import { PATH_DASHBOARD } from '../../routes/path';
import { faker } from '@faker-js/faker';
import { useDispatch, useSelector } from 'react-redux';
import { SwitchMode } from '../../store/settings/settings.action';
import { AppDispatch } from '../../store';
import { selectSettings } from '../../store/settings/settings.slice';
// import Logo from '../../assets/images/logo.ico';

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
  };
};

const siderMenus: MenuItem[] = [
  getItem(
    'Chat',
    PATH_DASHBOARD.app.chat,
    <NavLink to={PATH_DASHBOARD.app.chat}>
      <ChatCircleDots />
    </NavLink>
  ),
  getItem(
    'Group',
    PATH_DASHBOARD.app.group,
    <NavLink to={PATH_DASHBOARD.app.group}>
      <Users />
    </NavLink>
  ),
  getItem(
    'Call',
    PATH_DASHBOARD.app.call,
    <NavLink to={PATH_DASHBOARD.app.call}>
      <Phone />
    </NavLink>
  ),
  { type: 'divider' },
  getItem(
    'Setting',
    PATH_DASHBOARD.app.settings,
    <NavLink to={PATH_DASHBOARD.app.settings}>
      <GearSix />
    </NavLink>
  ),
];
const Sider = () => {
  const location = useLocation();
  const { token } = theme.useToken();
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector(selectSettings);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        paddingTop: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Col>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            style={{ backgroundColor: token.colorPrimary, borderRadius: 12 }}
            height='64px'
            width='64px'
            preview={false}
            src={require('../../assets/images/logo.ico')}
            alt='Logo'
          />
        </div>
        <Menu
          style={{ width: '100%' }}
          selectedKeys={[location.pathname]}
          items={siderMenus}
        />
      </Col>
      <Space direction='vertical' size={12}>
        <Row justify='center'>
          <Switch
            checked={settings.theme.mode === 'dark'}
            onChange={() => dispatch(SwitchMode())}
          />
        </Row>
        <Row justify='center'>
          <Avatar size='large' src={faker.image.avatar()} />
        </Row>
      </Space>
    </div>
  );
};

export default Sider;
