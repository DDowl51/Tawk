import Icon from '@ant-design/icons';
import { theme, Space, Row, Typography, Button, ButtonProps } from 'antd';
import Avatar from 'components/Avatar';
import { PhoneSlash, Phone } from 'phosphor-react';
import { useRef, useCallback, useEffect, CSSProperties, FC } from 'react';
import toast, { Toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useStopwatch } from 'react-timer-hook';
import { useAppDispatch } from 'store';
import { SetSingleChatroom } from 'store/data/data.action';
import { EndCall, CreateAnswer } from 'store/media/media.action';
import { selectMedia } from 'store/media/media.slice';
import {
  CloseMessageSider,
  OpenAudioSider,
  OpenVideoSider,
} from 'store/ui/ui.action';

const prefixZero = (num: number) => num.toString().padStart(2, '0');

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

const MediaToast = () => {
  const { targetUser, status, answerData, loading, type, callLogId } =
    useSelector(selectMedia);
  const toastIdRef = useRef<string>('');
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();

  const duration = useStopwatch({ autoStart: false });

  const name = targetUser?.name || '';

  useEffect(() => {
    console.log('mounted');
  }, []);

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
    // 关闭Notification
    toast.dismiss(toastIdRef.current);
    // 重置计时器
    duration.reset();
    duration.pause();
  }, [duration, dispatch, status, answerData, callLogId]);

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
    // set current single chatroom
    dispatch(SetSingleChatroom(targetUser!._id));
    // 关闭Notification
    toast.dismiss(toastIdRef.current);
    // 打开对应界面
    if (type === 'audio') {
      dispatch(OpenAudioSider());
    }
    if (type === 'video') {
      dispatch(OpenVideoSider());
    }

    //  同意通话邀请
    dispatch(
      CreateAnswer(
        answerData!.type,
        answerData!.remoteSDP,
        answerData!.from,
        answerData!.callLogId
      )
    );
  }, [dispatch, answerData, type, targetUser]);

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
          {name} want to have a {type === 'audio' ? 'audio' : 'video'} chat with
          you
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
    type,
    name,
    rejectButton,
    token.colorBgContainer,
    token.colorText,
  ]);

  // Update toast timer
  useEffect(() => {
    if (status === 'answering') {
      // 收到通话邀请
      handleToast();
    }
    if (status === 'calling' && !duration.isRunning) {
      // 开始通话
      duration.reset();
      duration.start();
    }
    if (status === 'calling') {
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

  return null;
};

export default MediaToast;
