import { Button, Divider, Row, Typography } from 'antd';
import Icon from '@ant-design/icons';
import { GithubLogo, GoogleLogo, TwitterLogo } from 'phosphor-react';

const AuthSocial = () => {
  return (
    <>
      <Divider style={{ borderBlockStartColor: 'rgba(0, 0, 0, 0.6)' }} dashed>
        <Typography.Text type='secondary' style={{ fontWeight: 'bold' }}>
          OR
        </Typography.Text>
      </Divider>
      <Row justify='center' style={{ gap: 24 }}>
        <Button
          shape='circle'
          size='large'
          icon={<Icon component={() => <GithubLogo size={20} />} />}
        />
        <Button
          shape='circle'
          size='large'
          icon={
            <Icon component={() => <GoogleLogo size={20} color='#df3e30' />} />
          }
        />
        <Button
          shape='circle'
          size='large'
          icon={
            <Icon component={() => <TwitterLogo size={20} color='#1c9cea' />} />
          }
        />
      </Row>
    </>
  );
};

export default AuthSocial;
