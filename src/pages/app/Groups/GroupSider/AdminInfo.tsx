import { Row, Skeleton, Space, theme, Typography } from 'antd';
import Avatar from 'components/Avatar';
import { FC } from 'react';
import { useGetUserByIdQuery } from 'store/services';

const AdminInfo: FC<{ userId: string }> = ({ userId }) => {
  const { data: user, error, isLoading } = useGetUserByIdQuery(userId);
  const { token } = theme.useToken();

  console.log(user);

  return (
    <>
      {error ? (
        <>{error}</>
      ) : isLoading ? (
        <Skeleton avatar paragraph={{ rows: 1 }} />
      ) : user ? (
        <Row
          wrap={false}
          style={{
            backgroundColor: token.colorBgContainer,
            padding: 6,
            borderRadius: 8,
          }}
          align='middle'
        >
          <Avatar
            src={user.avatar}
            alt={user.name}
            style={{ marginRight: 12 }}
            size={36}
          />
          <Space.Compact direction='vertical'>
            <Typography.Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {user.name}
            </Typography.Text>
            <Typography.Text type='secondary' style={{ fontSize: 12 }}>
              {user.email}
            </Typography.Text>
          </Space.Compact>
        </Row>
      ) : null}
    </>
  );
};

export default AdminInfo;
