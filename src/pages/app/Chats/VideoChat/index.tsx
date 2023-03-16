import Icon from '@ant-design/icons';
import { Button, Row, Typography, Space } from 'antd';
import toast from 'react-hot-toast';
import { Phone, PhoneSlash, X } from 'phosphor-react';
import React, { FC, useEffect, useCallback, useState, useRef } from 'react';
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
  const [noteOpen, setNoteOpen] = useState(false); // 来电提醒通知框是否已经打开

  const videoToastRef = useRef<string>('');
  const { targetUser, answerData, status, loading, type } =
    useSelector(selectMedia);

  const title = targetUser
    ? `与${targetUser.name}通话中`
    : `与${user.name}通话`;

  const handleFullscreen: React.MouseEventHandler<HTMLVideoElement> = e => {
    e.currentTarget.requestFullscreen();
  };

  const handleReject = useCallback(() => {
    // 拒绝通话邀请
    dispatch(EndCall('Reject'));
    // 关闭Notification
    toast.dismiss(videoToastRef.current);
  }, [dispatch]);

  const handleAccept = useCallback(() => {
    //  同意通话邀请
    dispatch(
      CreateAnswer(answerData!.type, answerData!.remoteSDP, answerData!.from)
    );
    // 关闭Notification
    toast.dismiss(videoToastRef.current);
    // 打开视频界面
    dispatch(OpenVideoSider());
  }, [dispatch, answerData]);

  const handleHangUp = () => {
    dispatch(EndCall('Hang up'));
    dispatch(CloseMessageSider());
  };

  // Update countdown of reject on the notification bar
  useEffect(() => {
    if (status === 'answering' && type === 'video') {
      console.log(type);
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
  }, [status, handleAccept, handleReject, type]);

  useEffect(() => {
    if (!noteOpen && status === 'answering' && type === 'video') {
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
  }, [status, noteOpen, handleAccept, handleReject, type]);

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
