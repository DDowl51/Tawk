import Icon from '@ant-design/icons';
import { Button, Row, Typography, Space } from 'antd';
import { X } from 'phosphor-react';
import React, { FC, useCallback } from 'react';
import { useAppDispatch } from 'store';
import { CloseMessageSider, OpenVideoSider } from 'store/ui/ui.action';
import { User } from 'types';
import { useSelector } from 'react-redux';
import { selectMedia } from 'store/media/media.slice';
import { CreateAnswer, CreateOffer, EndCall } from 'store/media/media.action';

type VideoChatProps = {
  user: Omit<User, 'friends'>;
};

const VideoChat: FC<VideoChatProps> = ({ user }) => {
  const dispatch = useAppDispatch();

  const { targetUser, answerData, status, loading, type, callLogId } =
    useSelector(selectMedia);

  const title = targetUser
    ? `与${targetUser.name}通话中`
    : `与${user.name}通话`;

  const handleFullscreen: React.MouseEventHandler<HTMLVideoElement> = e => {
    e.currentTarget.requestFullscreen();
  };

  const handleReject = useCallback(() => {
    // 拒绝通话邀请
    dispatch(EndCall('reject', answerData?.callLogId || callLogId));
  }, [dispatch, answerData, callLogId]);

  const handleAccept = useCallback(() => {
    //  同意通话邀请
    dispatch(
      CreateAnswer(
        answerData!.type,
        answerData!.remoteSDP,
        answerData!.from,
        answerData!.callLogId
      )
    );
    // 打开视频界面
    dispatch(OpenVideoSider());
  }, [dispatch, answerData]);

  const handleHangUp = () => {
    dispatch(EndCall('hang_up', answerData?.callLogId || callLogId));
    dispatch(CloseMessageSider());
  };

  return (
    <Row style={{ height: '100%', width: '100%', padding: 12 }}>
      <Row style={{ width: '100%' }} justify='space-between' align='middle'>
        <Typography.Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {title} {status}
        </Typography.Text>
        <Button
          onClick={() => dispatch(CloseMessageSider())}
          shape='circle'
          type='default'
          icon={<Icon component={() => <X />} />}
        />
      </Row>
      {/* Friend Video */}
      <Row style={{ width: '100%', height: '60%' }}>
        <video
          id='remote-video'
          onDoubleClick={handleFullscreen}
          autoPlay
          width='100%'
          height='100%'
        ></video>
      </Row>
      {/* Me Video */}
      <Row
        align='bottom'
        style={{
          height: '30%',
          width: '100%',
          position: 'relative',
        }}
      >
        <video
          id='local-video'
          onDoubleClick={handleFullscreen}
          autoPlay
          playsInline
          height='100%'
          width='60%'
        ></video>
        <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
          {(() => {
            if (type !== 'video')
              return (
                <Button
                  size='large'
                  loading={loading}
                  type='primary'
                  onClick={() => dispatch(CreateOffer('video', user))}
                >
                  Call
                </Button>
              );
            switch (status) {
              case 'offering':
              case 'idle':
                return (
                  <Button
                    size='large'
                    loading={loading}
                    type='primary'
                    onClick={() => dispatch(CreateOffer('video', user))}
                  >
                    Call
                  </Button>
                );
              case 'answering':
                return (
                  <Space>
                    <Button
                      size='large'
                      loading={loading}
                      type='primary'
                      onClick={handleAccept}
                    >
                      Answer
                    </Button>
                    <Button
                      size='large'
                      loading={loading}
                      type='primary'
                      danger
                      onClick={handleReject}
                    >
                      Reject
                    </Button>
                  </Space>
                );
              case 'calling':
                return (
                  <Button
                    size='large'
                    loading={loading}
                    type='primary'
                    danger
                    onClick={handleHangUp}
                  >
                    Hang up
                  </Button>
                );
            }
          })()}
        </div>
      </Row>
    </Row>
  );
};

export default VideoChat;
