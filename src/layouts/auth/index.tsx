import { Col, Row, Space } from 'antd';
import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <Col
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: 600,
        margin: '0 auto',
      }}
    >
      <img
        style={{ alignSelf: 'center' }}
        src={require('../../assets/images/logo.ico')}
        alt='Logo'
      />

      <Outlet />
    </Col>
  );
};

export default AuthLayout;
