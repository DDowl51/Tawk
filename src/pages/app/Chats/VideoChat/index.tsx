import Icon from '@ant-design/icons';
import { Button, Row, Typography, Space } from 'antd';
import toast from 'react-hot-toast';
import { Phone, PhoneSlash, X } from 'phosphor-react';
import React, {
  useContext,
  FC,
  useEffect,
  useCallback,
  useState,
  useRef,
} from 'react';
import { useAppDispatch } from 'store';
import { CloseMessageSider, OpenVideoSider } from 'store/ui/ui.action';
import { User } from 'types';
import { MediaContext } from '../context/MediaContext';

type VideoChatProps = {
  user: Omit<User, 'friends'>;
};

const VideoChat: FC<VideoChatProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const mediaCtx = useContext(MediaContext);
  const [noteOpen, setNoteOpen] = useState(false); // 来电提醒通知框是否已经打开

  const videoToastRef = useRef<string>('');

  const title = mediaCtx.targetUser
    ? `与${mediaCtx.targetUser.name}通话中`
    : `与${user.name}通话`;

  const handleFullscreen: React.MouseEventHandler<HTMLVideoElement> = e => {
    e.currentTarget.requestFullscreen();
  };

  const handleReject = useCallback(() => {
    // 拒绝通话邀请
    mediaCtx.rejectOffer('Reject');
    // 关闭Notification
    toast.dismiss(videoToastRef.current);
  }, [mediaCtx]);

  const handleAccept = useCallback(() => {
    //  同意通话邀请
    mediaCtx.answerOffer();
    // 关闭Notification
    toast.dismiss(videoToastRef.current);
    // 打开视频界面
    dispatch(OpenVideoSider());
  }, [mediaCtx, dispatch]);

  const handleHangUp = () => {
    mediaCtx.rejectOffer('Hang up');
    dispatch(CloseMessageSider());
  };

  // Update countdown of reject on the notification bar
  useEffect(() => {
    if (noteOpen && mediaCtx.timeoutReject > 0) {
      videoToastRef.current = toast.loading(
        <Space>
          <Typography.Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Someone is calling you
          </Typography.Text>
          <Space>
            <Button
              size='large'
              shape='circle'
              type='primary'
              onClick={handleAccept}
              icon={<Icon component={() => <Phone />} />}
            />
            <Button
              onClick={handleReject}
              size='large'
              shape='circle'
              type='primary'
              danger
              icon={<Icon component={() => <PhoneSlash />} />}
            />
          </Space>
        </Space>,
        {
          id: videoToastRef.current,
        }
      );
    }
  }, [
    mediaCtx.timeoutReject,
    noteOpen,
    mediaCtx.targetUser?.name,
    handleAccept,
    handleReject,
  ]);

  useEffect(() => {
    if (!noteOpen && mediaCtx.status === 'answering') {
      setNoteOpen(true);
      videoToastRef.current = toast.loading(
        <Space>
          <Typography.Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Someone is calling you
          </Typography.Text>
          <Space>
            <Button
              size='large'
              shape='circle'
              type='primary'
              onClick={handleAccept}
              icon={<Icon component={() => <Phone />} />}
            />
            <Button
              onClick={handleReject}
              size='large'
              shape='circle'
              type='primary'
              danger
              icon={<Icon component={() => <PhoneSlash />} />}
            />
          </Space>
        </Space>,
        {
          id: videoToastRef.current,
        }
      );
    }
  }, [
    mediaCtx.status,
    mediaCtx.targetUser?.name,
    noteOpen,
    handleAccept,
    handleReject,
  ]);

  return (
    <Row style={{ height: '100%', width: '100%', padding: 12 }}>
      <Row style={{ width: '100%' }} justify='space-between' align='middle'>
        <Typography.Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {title} {mediaCtx.status}
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
          ref={mediaCtx.remoteMediaRef as React.RefObject<HTMLVideoElement>}
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
          ref={mediaCtx.localMediaRef as React.RefObject<HTMLVideoElement>}
          height='100%'
          width='60%'
        ></video>
        <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
          {(() => {
            switch (mediaCtx.status) {
              case 'offering':
              case 'idle':
                return (
                  <Button
                    size='large'
                    loading={mediaCtx.loading}
                    type='primary'
                    onClick={mediaCtx.createOffer}
                  >
                    Call
                  </Button>
                );
              case 'answering':
                return (
                  <Space>
                    <Button
                      size='large'
                      loading={mediaCtx.loading}
                      type='primary'
                      onClick={handleAccept}
                    >
                      Answer
                    </Button>
                    <Button
                      size='large'
                      loading={mediaCtx.loading}
                      type='primary'
                      danger
                      onClick={handleReject}
                    >
                      Reject({mediaCtx.timeoutReject}s)
                    </Button>
                  </Space>
                );
              case 'calling':
                return (
                  <Button
                    size='large'
                    loading={mediaCtx.loading}
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
