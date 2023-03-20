import React from 'react';
import { Menu, Col, Row, Image, theme, Switch, Space, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  ChatCircleDots,
  Users,
  Phone,
  GearSix,
  User,
  SignOut,
} from 'phosphor-react';
import { NavLink } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';

import { PATH_DASHBOARD } from 'routes/path';
import { useDispatch, useSelector } from 'react-redux';
import { SwitchMode } from 'store/settings/settings.action';
import { AppDispatch } from 'store';
import { selectSettings } from 'store/settings/settings.slice';
import Icon from '@ant-design/icons';
import { useMemo } from 'react';
import { Logout } from 'store/auth/auth.action';
import { selectData } from 'store/data/data.slice';
import Avatar from 'components/Avatar';
// import Logo from 'assets/images/logo.ico';

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?: (dispatch: any) => void,
  children?: MenuItem[]
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  };
};

const Sider = () => {
  const location = useLocation();
  const { token } = theme.useToken();
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector(selectSettings);
  const navigate = useNavigate();
  const { user } = useSelector(selectData);

  const siderMenus = useMemo<MenuItem[]>(
    () => [
      getItem(
        'Chat',
        PATH_DASHBOARD.app.chats,
        <NavLink to={PATH_DASHBOARD.app.chats}>
          <ChatCircleDots size={16} />
        </NavLink>
      ),
      getItem(
        'Group',
        PATH_DASHBOARD.app.groups,
        <NavLink to={PATH_DASHBOARD.app.groups}>
          <Icon component={() => <Users size={18} />} />
        </NavLink>
      ),
      getItem(
        'Call',
        PATH_DASHBOARD.app.calls,
        <NavLink to={PATH_DASHBOARD.app.calls}>
          <Icon component={() => <Phone size={18} />} />
        </NavLink>
      ),
      { type: 'divider' },
      getItem(
        'Setting',
        PATH_DASHBOARD.app.settings.root,
        <NavLink to={PATH_DASHBOARD.app.settings.root}>
          <Icon component={() => <GearSix size={18} />} />
        </NavLink>
      ),
      getItem(
        'Logout',
        'sider-logout',
        <NavLink to={PATH_DASHBOARD.app.settings.root}>
          <Icon component={() => <SignOut size={18} />} />
        </NavLink>,
        () => dispatch(Logout())
      ),
    ],
    [dispatch]
  );

  const profileMenu = useMemo(() => {
    return [
      getItem(
        'Profile',
        PATH_DASHBOARD.app.profile,
        <Icon component={() => <User size={16} />} />,
        () => navigate(PATH_DASHBOARD.app.profile)
      ),
      getItem(
        'Settings',
        `${PATH_DASHBOARD.app.settings}-profile`,
        <Icon component={() => <GearSix size={16} />} />,
        () => navigate(PATH_DASHBOARD.app.settings.root)
      ),
      getItem(
        'Logout',
        'logout',
        <Icon component={() => <SignOut size={16} />} />,
        () => dispatch(Logout())
      ),
    ];
  }, [navigate, dispatch]);

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
            src={require('assets/images/logo.ico')}
            alt='Logo'
          />
        </div>
        <Menu
          style={{ width: '100%', backgroundColor: 'transparent' }}
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
          <Dropdown
            placement='topLeft'
            menu={{ items: profileMenu }}
            trigger={['contextMenu']}
          >
            <Avatar
              onClick={() => navigate(PATH_DASHBOARD.app.profile)}
              style={{ cursor: 'pointer' }}
              size='large'
              src={user?.avatar}
            />
          </Dropdown>
        </Row>
      </Space>
    </div>
  );
};

export default Sider;
