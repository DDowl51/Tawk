import { Button, Row, Skeleton, Space, theme, Typography } from 'antd';
import Icon from '@ant-design/icons';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Phone,
  VideoCamera,
} from 'phosphor-react';
import { FC, useMemo } from 'react';
import Avatar from 'components/Avatar';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/auth/auth.slice';
import { useGetCallLogByIdQuery, useGetUserByIdQuery } from 'store/services';
import { dateTo } from 'utils';
import { CallLog } from 'types';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/path';
import { useAppDispatch } from 'store';
import { SetSingleChatroom } from 'store/data/data.action';
import { OpenAudioSider, OpenVideoSider } from 'store/ui/ui.action';

type CallListItemProps = {
  logId: string;
};

const CallListItem: FC<CallListItemProps> = ({ logId }) => {
  const { token } = theme.useToken();
  const { userId } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    data: callLog,
    error: callLogError,
    isLoading: callLogIsLoading,
  } = useGetCallLogByIdQuery(logId);

  const friendId = useMemo(() => {
    if (callLog) {
      if (callLog.sender === userId) return callLog.recipient;
      else return callLog.sender;
    } else {
      return '';
    }
  }, [callLog, userId]);

  const {
    data: friend,
    error: friendError,
    isLoading: friendIsLoading,
  } = useGetUserByIdQuery(friendId, { skip: !callLog });

  const handleCall = (callLog: CallLog) => {
    navigate(PATH_DASHBOARD.app.chats);
    dispatch(SetSingleChatroom(friendId));
    if (callLog.type === 'audio') {
      // go to audio page
      dispatch(OpenAudioSider());
    } else if (callLog.type === 'video') {
      // go to video page
      dispatch(OpenVideoSider());
    }
  };

  return (
    <>
      {friendError || callLogError ? (
        <>{friendError || callLogError}</>
      ) : friendIsLoading || callLogIsLoading ? (
        <Skeleton avatar paragraph={{ rows: 0 }} />
      ) : callLog && friend ? (
        <Row
          wrap={false}
          style={{
            backgroundColor: token.colorBgContainer,
            padding: 12,
            borderRadius: 8,
          }}
          justify='space-between'
          align='middle'
        >
          <Row align='middle' style={{ gap: 8 }}>
            <Avatar src={friend.avatar} online={friend.online} />
            <Space direction='vertical' size={2}>
              <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1 }}>
                {friend.name}
              </Typography.Text>
              <Row>
                <Icon
                  component={() =>
                    callLog.recipient === userId ? (
                      <ArrowDownLeft
                        color={
                          callLog.missed ? token.colorError : token.colorSuccess
                        }
                        size={16}
                      />
                    ) : (
                      <ArrowUpRight
                        color={
                          callLog.missed ? token.colorError : token.colorSuccess
                        }
                        size={16}
                      />
                    )
                  }
                />
                <Typography.Text
                  type='secondary'
                  style={{ fontWeight: 'bold', fontSize: 12, lineHeight: 1 }}
                >
                  {dateTo(callLog.createdAt)}
                </Typography.Text>
              </Row>
            </Space>
          </Row>

          <Row>
            <Button
              onClick={() => handleCall(callLog)}
              shape='circle'
              size='large'
              type='text'
              icon={
                <Icon
                  component={() =>
                    callLog.type === 'audio' ? (
                      <Phone color={token.colorSuccess} />
                    ) : (
                      <VideoCamera color={token.colorSuccess} />
                    )
                  }
                />
              }
            />
          </Row>
        </Row>
      ) : null}
    </>
  );
};

export default CallListItem;
