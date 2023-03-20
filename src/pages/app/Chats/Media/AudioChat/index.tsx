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
  X,
} from 'phosphor-react';
import { FC, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
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

const format = (duration: any) => {
  const formatArr = [duration.minutes, duration.seconds];
  if (duration.hours !== 0 || duration.days !== 0)
    formatArr.unshift(duration.hours);
  if (duration.days !== 0) formatArr.unshift(duration.days);

  return formatArr.map(n => prefixZero(n)).join(':');
};

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
    callLogId,
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
      dispatch(EndCall('reject', answerData?.callLogId || callLogId));
    }
    if (status === 'offering') {
      // 取消通话邀请
      dispatch(EndCall('cancel', answerData?.callLogId || callLogId));
    }
    if (status === 'calling') {
      // 挂断通话
      dispatch(EndCall('hang_up', answerData?.callLogId || callLogId));
      dispatch(CloseMessageSider());
    }
    // 重置计时器
    duration.reset();
    duration.pause();
  }, [duration, dispatch, status, answerData, callLogId]);

  const handleAccept = useCallback(() => {
    if (status === 'answering') {
      //  同意通话邀请
      dispatch(
        CreateAnswer(
          answerData!.type,
          answerData!.remoteSDP,
          answerData!.from,
          answerData!.callLogId
        )
      );
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

  // Update toast timer
  useEffect(() => {
    if (status === 'calling' && !duration.isRunning) {
      // 开始通话
      duration.reset();
      duration.start();
    }

    if (status === 'idle' && toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
  }, [status, duration, duration.seconds, type]);

  useEffect(() => {
    if (duration.isRunning && status === 'idle') {
      // 对方挂断
      duration.reset();
      duration.pause();
    }
  }, [duration, duration.isRunning, status]);

  return (
    <Col
      style={{
        padding: 24,
        width: '100%',
        height: '100%',
        gap: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Row justify='end' align='middle'>
        <Button
          shape='circle'
          onClick={() => dispatch(CloseMessageSider())}
          icon={<Icon component={() => <X />} />}
        />
      </Row>
      <Space
        direction='vertical'
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
          gap: 0,
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
    </Col>
  );
};

export default AudioChat;
