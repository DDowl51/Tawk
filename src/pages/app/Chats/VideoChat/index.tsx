import Icon from '@ant-design/icons';
import { Button, Row, Typography, notification, Space } from 'antd';
import { VideoContext } from 'pages/app/Chats/VideoChat/context/VideoContext';
import { X } from 'phosphor-react';
import React, {
  useContext,
  FC,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react';
import { useAppDispatch } from 'store';
import { CloseMessageSider, OpenVideoSider } from 'store/ui/ui.action';
import { User } from 'types';

type VideoChatProps = {
  user: Omit<User, 'friends'>;
};

const VideoChat: FC<VideoChatProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const videoCtx = useContext(VideoContext);
  const [api, contextHolder] = notification.useNotification();
  const [noteOpen, setNoteOpen] = useState(false); // 来电提醒通知框是否已经打开

  const title = videoCtx.targetUser
    ? `与${videoCtx.targetUser.name}通话中`
    : `与${user.name}通话`;

  const handleFullscreen: React.MouseEventHandler<HTMLVideoElement> = e => {
    e.currentTarget.requestFullscreen();
  };

  const handleReject = useCallback(() => {
    // 拒绝通话邀请
    videoCtx.rejectOffer('Reject');
    // 关闭Notification
    api.destroy('answer-video');
  }, [api, videoCtx]);

  const handleAccept = useCallback(() => {
    //  同意通话邀请
    videoCtx.answerOffer();
    // 关闭Notification
    api.destroy('answer-video');
    // 打开视频界面
    dispatch(OpenVideoSider());
  }, [api, videoCtx, dispatch]);

  const handleHangUp = () => {
    videoCtx.rejectOffer('Hang up');
    dispatch(CloseMessageSider());
  };

  const handleAnswerButtons = useMemo(
    () => (
      <Space>
        <Button
          size='large'
          loading={videoCtx.loading}
          type='primary'
          onClick={handleAccept}
        >
          Answer
        </Button>
        <Button
          size='large'
          loading={videoCtx.loading}
          type='primary'
          danger
          onClick={handleReject}
        >
          Reject({videoCtx.timeoutReject}s)
        </Button>
      </Space>
    ),
    [handleReject, videoCtx, handleAccept]
  );

  // Update countdown of reject on the notification bar
  useEffect(() => {
    if (noteOpen && videoCtx.timeoutReject > 0) {
      api.open({
        message: `${videoCtx.targetUser?.name} called you!`,
        type: 'info',
        duration: 60,
        placement: 'top',
        key: 'answer-video',
        btn: handleAnswerButtons,
        onClose() {
          setNoteOpen(false);
        },
      });
    }
  }, [
    videoCtx.timeoutReject,
    noteOpen,
    api,
    handleAnswerButtons,
    videoCtx.targetUser?.name,
  ]);

  useEffect(() => {
    if (!noteOpen && videoCtx.status === 'answering') {
      setNoteOpen(true);
      api.open({
        message: `${videoCtx.targetUser?.name} called you!`,
        type: 'info',
        duration: 60,
        placement: 'top',
        key: 'answer-video',
        btn: handleAnswerButtons,
        onClose() {
          setNoteOpen(false);
        },
      });
    }
  }, [
    videoCtx.status,
    api,
    videoCtx.targetUser?.name,
    handleAnswerButtons,
    noteOpen,
  ]);

  return (
    <>
      {contextHolder}
      <Row style={{ height: '100%', width: '100%', padding: 12 }}>
        <Row style={{ width: '100%' }} justify='space-between' align='middle'>
          <Typography.Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {title}
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
            onDoubleClick={handleFullscreen}
            ref={videoCtx.remoteVideoRef}
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
            onDoubleClick={handleFullscreen}
            autoPlay
            playsInline
            ref={videoCtx.localVideoRef}
            height='100%'
            width='60%'
          ></video>
          <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
            {(() => {
              switch (videoCtx.status) {
                case 'offering':
                case 'idle':
                  return (
                    <Button
                      size='large'
                      loading={videoCtx.loading}
                      type='primary'
                      onClick={videoCtx.createOffer}
                    >
                      Call
                    </Button>
                  );
                case 'answering':
                  return handleAnswerButtons;
                case 'calling':
                  return (
                    <Button
                      size='large'
                      loading={videoCtx.loading}
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
    </>
  );
};

export default VideoChat;
