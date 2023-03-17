import { Button, Row, Skeleton, theme, Typography } from 'antd';
import { FC } from 'react';
import Icon from '@ant-design/icons';

import Avatar from 'components/Avatar';
import { Phone, VideoCamera } from 'phosphor-react';
import { useAppDispatch } from 'store';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/path';
import { SetSingleChatroom } from 'store/data/data.action';
import { OpenAudioSider, OpenVideoSider } from 'store/ui/ui.action';
import { useGetUserByIdQuery } from 'store/services';

type NewCallItemProps = {
  userId: string;
};

const NewCallItem: FC<NewCallItemProps> = ({ userId }) => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: user, error, isLoading } = useGetUserByIdQuery(userId);

  const handleCall = (type: 'audio' | 'video') => {
    // 导航去聊天界面
    navigate(PATH_DASHBOARD.app.chats);

    // 设置当前聊天对象为所选用户
    dispatch(SetSingleChatroom(userId));

    // 打开电话/视频界面
    switch (type) {
      case 'audio':
        dispatch(OpenAudioSider());
        break;
      case 'video':
        dispatch(OpenVideoSider());
        break;
    }
  };

  return (
    <Row
      wrap={false}
      style={{
        backgroundColor: token.colorBgContainer,
        padding: 12,
        borderRadius: 12,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
      justify='space-between'
      align='middle'
    >
      {error ? (
        <>{error}</>
      ) : isLoading ? (
        <Skeleton avatar paragraph={{ rows: 1 }} />
      ) : user ? (
        <>
          <Row justify='space-between' align='middle' style={{ gap: 8 }}>
            <Avatar online={user.online} src={user.avatar} alt={user.name} />
            <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1 }}>
              {user.name}
            </Typography.Text>
          </Row>

          <Row>
            <Button
              onClick={() => handleCall('audio')}
              size='large'
              shape='circle'
              type='text'
              icon={
                <Icon component={() => <Phone color={token.colorSuccess} />} />
              }
            />
            <Button
              onClick={() => handleCall('video')}
              size='large'
              shape='circle'
              type='text'
              icon={
                <Icon
                  component={() => <VideoCamera color={token.colorSuccess} />}
                />
              }
            />
          </Row>
        </>
      ) : (
        <></>
      )}
    </Row>
  );
};

export default NewCallItem;
