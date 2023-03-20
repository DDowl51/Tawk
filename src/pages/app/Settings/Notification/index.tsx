import {
  Button,
  Form,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Switch,
} from 'antd';
import useNotification from 'hooks/useNotification';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { toast, ToastPosition } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'store';
import { useGetUserFriendsQuery } from 'store/services';
import {
  MuteFriend,
  SetNotification,
  UnmuteFriend,
} from 'store/settings/settings.action';
import { selectSettings, SettingsState } from 'store/settings/settings.slice';
import { User } from 'types';

type PositionAction = {
  type: 'position';
  payload: ToastPosition;
};
type DurationAction = {
  type: 'duration';
  payload: number;
};
type EnabledAction = {
  type: 'enabled';
  payload: boolean;
};

type ActionType = PositionAction | DurationAction | EnabledAction;

const notificationReducer = (
  state: SettingsState['notification'],
  action: ActionType
): SettingsState['notification'] => {
  switch (action.type) {
    case 'position':
      return { ...state, position: action.payload };
    case 'duration':
      return { ...state, duration: action.payload };
    case 'enabled': // switch
      console.log(state);
      return { ...state, enabled: action.payload };
    default:
      return state;
  }
};

const Notification = () => {
  const { notification, mutedFriends } = useSelector(selectSettings);
  const [state, dispatch] = useReducer(notificationReducer, notification);
  const [form] = Form.useForm();
  const dispatchStore = useAppDispatch();
  const navigate = useNavigate();
  const touched = form.isFieldsTouched(false) && form.isFieldsTouched(false);

  const { data: friends, error, isLoading } = useGetUserFriendsQuery(null);
  const [mutedFriendsInfo, setMutedFriendsInfo] = useState<User[]>([]);

  useEffect(() => {
    if (friends) {
      setMutedFriendsInfo(friends.filter(f => mutedFriends.includes(f._id)));
    }
  }, [friends, mutedFriends]);

  const handleEnabled = () => {
    if (state.enabled) {
      dispatch({ type: 'enabled', payload: false });
    } else {
      dispatch({ type: 'enabled', payload: true });
    }
  };

  const handleSetPosition = (event: RadioChangeEvent) => {
    dispatch({
      type: 'position',
      payload: event.target.value,
    });
    toast.success('sample notification', {
      duration: state.duration,
      position: event.target.value,
    });
  };

  const handleSetDuration = (num: number | null) => {
    if (num) {
      dispatch({ type: 'duration', payload: num });
    }
  };

  const handleSubmit = (formValues: SettingsState['notification']) => {
    console.log(formValues);
    dispatchStore(SetNotification(formValues));
    toast.success('Settings saved!', {
      duration: state.duration,
      position: state.position,
    });
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name='enabled'
        label='enabled'
        valuePropName='checked'
        initialValue={state.enabled}
      >
        {/* switch的value保存在checked里面 */}
        <Switch checked={state.enabled} onChange={handleEnabled} />
      </Form.Item>
      <Form.Item
        initialValue={state.position}
        name='position'
        label='Notification position'
      >
        <Radio.Group disabled={!state.enabled} onChange={handleSetPosition}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Radio.Button value='top-left'>Top Left</Radio.Button>
            <Radio.Button value='top-center'>Top Center</Radio.Button>
            <Radio.Button value='top-right'>Top Right</Radio.Button>
          </Space>
          <br />
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Radio.Button value='bottom-left'>Bottom Left</Radio.Button>
            <Radio.Button value='bottom-center'>Bottom Center</Radio.Button>
            <Radio.Button value='bottom-right'>Bottom Right</Radio.Button>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item initialValue={state.duration} name='duration' label='duration'>
        <InputNumber
          step={1000}
          disabled={!state.enabled}
          onChange={handleSetDuration}
          addonAfter='ms'
        />
      </Form.Item>

      <Form.Item label='Muted friends'>
        <Select
          mode='multiple'
          optionFilterProp='label'
          loading={isLoading}
          defaultValue={mutedFriends}
          onSelect={id => dispatchStore(MuteFriend(id))}
          onDeselect={id => dispatchStore(UnmuteFriend(id))}
        >
          {friends &&
            friends.map(f => (
              <Select.Option key={f._id} value={f._id} label={f._id}>
                {f.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Button.Group>
        <Button htmlType='submit' type='primary' disabled={!touched}>
          Submit
        </Button>
        <Button onClick={() => navigate(-1)}>Cancel</Button>
      </Button.Group>
    </Form>
  );
};

export default Notification;
