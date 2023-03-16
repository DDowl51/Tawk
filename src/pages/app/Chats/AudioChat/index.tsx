import Icon from '@ant-design/icons/lib/components/Icon';
import { Button, ButtonProps, Col, Row, Space, theme, Typography } from 'antd';
import Avatar from 'components/Avatar';
import {
  Microphone,
  MicrophoneSlash,
  Phone,
  PhoneSlash,
  SpeakerHigh,
  SpeakerSlash,
} from 'phosphor-react';
import { CSSProperties, FC, useCallback, useEffect, useRef } from 'react';
import toast, { Toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useStopwatch } from 'react-timer-hook';
import { useAppDispatch } from 'store';
import {
  CreateAnswer,
  CreateOffer,
  EndCall,
  SetLocal,
} from 'store/media/media.action';
import { selectMedia } from 'store/media/media.slice';
import { CloseMessageSider, OpenAudioSider } from 'store/ui/ui.action';
import { User } from 'types';

const prefixZero = (num: number) => num.toString().padStart(2, '0');

const IconButton: FC<Omit<ButtonProps, 'size'> & { size?: number }> = ({
  size = 24,
  ...props
}) => {
  return (
    <Button
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...props}
    />
  );
};

const updateToast = (
  id: string,
  content: Toast['message'],
  style: CSSProperties
) => {
  const toastId = toast.loading(content, {
    id,
    icon: <Avatar />,
    position: 'top-center',
    style,
  });
  return toastId;
};

const format = (duration: any) => {
  const formatArr = [duration.minutes, duration.seconds];
  if (duration.hours !== 0 || duration.days !== 0)
    formatArr.unshift(duration.hours);
  if (duration.days !== 0) formatArr.unshift(duration.days);

  return formatArr.map(n => prefixZero(n)).join(':');
};

type AudioChatProps = {
  user: Omit<User, 'friends'>;
};

const AudioChat: FC<AudioChatProps> = ({ user }) => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();
  const {
    targetUser,
    status,
    answerData,
    loading,
    localDevices,
    remoteDevices,
    type,
  } = useSelector(selectMedia);

  const toastIdRef = useRef<string>('');
  const duration = useStopwatch({ autoStart: false });

  const { name } = targetUser || user;

  const handleMicrophone = () => {
    dispatch(SetLocal('microphone', !localDevices.microphone));
  };
  const handleSpeaker = () => {
    dispatch(SetLocal('speaker', !localDevices.speaker));
  };

  // 拒绝或者挂断
  const handleReject = useCallback(() => {
    if (status === 'answering') {
      // 拒绝通话邀请
      dispatch(EndCall('Reject'));
    }
    if (status === 'offering') {
      // 取消通话邀请
      dispatch(EndCall('Cancel'));
    }
    if (status === 'calling') {
      // 挂断通话
      dispatch(EndCall('Hang up'));
      dispatch(CloseMessageSider());
    }
    // 关闭Notification
    toast.dismiss(toastIdRef.current);
    // 重置计时器
    duration.reset();
    duration.pause();
  }, [duration, dispatch, status]);

  const updateToastCalling = useCallback(() => {
    toastIdRef.current = updateToast(
      toastIdRef.current,
      <Space>
        <Row
          align='middle'
          wrap={false}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: 200,
          }}
        >
          <Typography.Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {name}
          </Typography.Text>
          <Typography.Text type='secondary' style={{ fontSize: 12 }}>
            {format(duration)}
          </Typography.Text>
        </Row>
        <Button
          onClick={handleReject}
          size='large'
          shape='circle'
          type='primary'
          danger
          icon={<Icon component={() => <PhoneSlash />} />}
        />
      </Space>,
      {
        backgroundColor: token.colorBgContainer,
        color: token.colorText,
      }
    );
  }, [token.colorBgContainer, token.colorText, handleReject, duration, name]);

  const handleAccept = useCallback(() => {
    if (status === 'answering') {
      //  同意通话邀请
      dispatch(
        CreateAnswer(answerData!.type, answerData!.remoteSDP, answerData!.from)
      );
      // 关闭Notification
      toast.dismiss(toastIdRef.current);
    } else {
      dispatch(CreateOffer('audio', user));
    }
    // 打开语音界面
    dispatch(OpenAudioSider());
  }, [dispatch, answerData, status, user]);

  const acceptButton = useCallback(
    (size: number, iconSize: number = 28) => (
      <IconButton
        onClick={handleAccept}
        loading={loading}
        shape='circle'
        type='primary'
        size={size}
        icon={<Phone size={iconSize} />}
      />
    ),
    [handleAccept, loading]
  );
  const rejectButton = useCallback(
    (size: number, iconSize: number = 28) => (
      <IconButton
        onClick={handleReject}
        loading={loading}
        shape='circle'
        danger
        type='primary'
        size={size}
        icon={<PhoneSlash size={iconSize} />}
      />
    ),
    [handleReject, loading]
  );

  const handleToast = useCallback(() => {
    toastIdRef.current = updateToast(
      toastIdRef.current,
      <Space>
        <Typography.Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          {name} is calling you
        </Typography.Text>
        <Space>
          {acceptButton(36, 18)}
          {rejectButton(36, 18)}
        </Space>
      </Space>,
      {
        backgroundColor: token.colorBgContainer,
        color: token.colorText,
      }
    );
  }, [
    acceptButton,
    name,
    rejectButton,
    token.colorBgContainer,
    token.colorText,
  ]);

  // Update toast timer
  useEffect(() => {
    if (status === 'answering' && type === 'audio') {
      // 收到通话邀请
      handleToast();
    }
    if (status === 'calling' && !duration.isRunning) {
      // 开始通话
      duration.reset();
      duration.start();
    }
    if (status === 'calling' && type === 'audio') {
      // 通话中，更新toast中的时间
      updateToastCalling();
    }
    if (status === 'idle' && toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
  }, [
    status,
    duration,
    duration.seconds,
    updateToastCalling,
    handleToast,
    type,
  ]);

  useEffect(() => {
    if (duration.isRunning && status === 'idle') {
      // 对方挂断
      duration.reset();
      duration.pause();

      toast.dismiss(toastIdRef.current);
    }
  }, [duration, duration.isRunning, status]);

  return (
    <Space
      direction='vertical'
      style={{
        padding: 24,
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Col
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: 24,
          backgroundColor: token.colorBgElevated,
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Avatar style={{ marginTop: 24 }} size={80} />
        <Typography.Text style={{ fontSize: 24, fontWeight: '600' }}>
          {name}
        </Typography.Text>
        <Typography.Text style={{ fontSize: 16 }} type='secondary'>
          {format(duration)}
        </Typography.Text>
        <Row style={{ gap: 24 }}>
          {remoteDevices.microphone && (
            <MicrophoneSlash color={token.colorTextTertiary} size={18} />
          )}
          {remoteDevices.speaker && (
            <SpeakerSlash color={token.colorTextTertiary} size={18} />
          )}
        </Row>
      </Col>

      <audio
        id='remote-audio'
        style={{ visibility: 'hidden' }}
        muted={localDevices.speaker}
        autoPlay
      />
      <audio id='local-audio' style={{ visibility: 'hidden' }} muted />

      <Col
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 32,
        }}
      >
        {status === 'calling' && (
          <Row style={{ justifyContent: 'center', gap: 56 }}>
            <IconButton
              shape='circle'
              size={48}
              onClick={handleMicrophone}
              type={localDevices.microphone ? 'primary' : 'default'}
              icon={
                <Icon
                  component={() =>
                    localDevices.microphone ? (
                      <MicrophoneSlash size={18} />
                    ) : (
                      <Microphone size={18} />
                    )
                  }
                />
              }
            />
            <IconButton
              shape='circle'
              size={48}
              onClick={handleSpeaker}
              type={localDevices.speaker ? 'primary' : 'default'}
              icon={
                <Icon
                  component={() =>
                    localDevices.speaker ? (
                      <SpeakerSlash size={18} />
                    ) : (
                      <SpeakerHigh size={18} />
                    )
                  }
                />
              }
            />
          </Row>
        )}
        <Row style={{ width: '100%', gap: 36 }} justify='center'>
          {(() => {
            if (type !== 'audio') return acceptButton(64);
            switch (status) {
              case 'idle':
              case 'producing':
                return acceptButton(64);
              case 'answering':
                return (
                  <>
                    {acceptButton(64)}
                    {rejectButton(64)}
                  </>
                );
              case 'offering':
              case 'calling':
                return rejectButton(64);
            }
          })()}
        </Row>
      </Col>
    </Space>
  );
};

export default AudioChat;
