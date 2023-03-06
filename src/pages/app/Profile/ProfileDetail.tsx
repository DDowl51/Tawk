import { Col, Typography } from 'antd';
import React from 'react';
import ProfileForm from './ProfileForm';

const ProfileDetail = () => {
  return (
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
        Profile
      </Typography.Title>

      <ProfileForm />
    </Col>
  );
};

export default ProfileDetail;
