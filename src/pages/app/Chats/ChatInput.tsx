import { Row, Button, Input, Popover, Space, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import {
  Plus,
  Smiley,
  PaperPlaneTilt,
  Camera,
  Sticker,
  User,
  Image,
  File,
} from 'phosphor-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useSelector } from 'react-redux';
import { selectSettings } from 'store/settings/settings.slice';

const Actions = [
  {
    icon: <Image />,
    title: 'Photo/Video',
  },
  {
    icon: <Sticker />,
    title: 'Stickers',
  },
  {
    icon: <Camera />,
    title: 'Image',
  },
  {
    icon: <File />,
    title: 'Document',
  },
  {
    icon: <User />,
    title: 'Contact',
  },
];

const AttachOptions = () => {
  return (
    <Space direction='vertical'>
      {Actions.map(action => (
        <Tooltip placement='right' title={action.title}>
          <Button
            type='primary'
            shape='circle'
            size='large'
            icon={<Icon component={() => action.icon} />}
          />
        </Tooltip>
      ))}
    </Space>
  );
};

const ChatInput = () => {
  const { theme } = useSelector(selectSettings);

  return (
    <>
      <Row wrap={false} style={{ gap: 8 }}>
        <Popover
          color='transparent'
          content={<AttachOptions />}
          title=''
          overlayInnerStyle={{ boxShadow: 'none' }}
          destroyTooltipOnHide
        >
          <Button size='large' icon={<Icon component={() => <Plus />} />} />
        </Popover>
        <Input.TextArea size='large' autoSize={{ minRows: 1, maxRows: 3 }} />
        <Popover
          mouseLeaveDelay={0.2}
          placement='topRight'
          content={<Picker data={data} theme={theme.mode} />}
          title=''
          autoAdjustOverflow
        >
          <Button size='large' icon={<Icon component={() => <Smiley />} />} />
        </Popover>
        <Button type='primary' size='large'>
          Send
          <Icon component={() => <PaperPlaneTilt />} />
        </Button>
      </Row>
    </>
  );
};

export default ChatInput;
