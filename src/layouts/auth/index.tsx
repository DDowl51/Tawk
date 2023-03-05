import { Col, theme } from 'antd';
import { Outlet } from 'react-router';

const AuthLayout = () => {
  const { token } = theme.useToken();

  return (
    <Col
      style={{
        height: '100vh',
        width: '100%',
        backgroundColor: token.colorBgBase,
      }}
    >
      <Col
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 600,
          margin: '0 auto',
        }}
      >
        <img
          style={{ alignSelf: 'center' }}
          src={require('assets/images/logo.ico')}
          alt='Logo'
        />

        <Outlet />
      </Col>
    </Col>
  );
};

export default AuthLayout;
