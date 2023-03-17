import {
  Col,
  Row,
  Typography,
  theme,
  Button,
  Input,
  Space,
  Divider,
} from 'antd';
import { useState } from 'react';
import Icon from '@ant-design/icons';
import { MagnifyingGlass, Plus } from 'phosphor-react';
import SimpleBarStyle from 'components/SimpleBarStyle';

import { CallLogs } from 'data';
import CallListItem from './CallListItem';
import NewCallModal from './NewCallModal';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';
// import CreateGroupModal from './CreateGroupModal';

const CallList = () => {
  const { token } = theme.useToken();
  const { user } = useSelector(selectData);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Col
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          height: '100%',
          width: 320,
        }}
      >
        <Space size={16} direction='vertical' style={{ width: '100%' }}>
          <Typography.Title style={{ margin: 0 }} level={3}>
            Call Logs
          </Typography.Title>
          <Input
            prefix={<Icon component={() => <MagnifyingGlass />} />}
            size='large'
            placeholder='Search...'
          />
          <Button
            type='text'
            size='large'
            style={{
              width: '100%',
            }}
            onClick={() => setDialogOpen(true)}
          >
            <Row justify='space-between'>
              <Typography.Text
                style={{ color: token.colorPrimary, fontWeight: 'bold' }}
              >
                Create New Conversation
              </Typography.Text>
              <Icon
                style={{ color: token.colorPrimary }}
                component={() => <Plus size={18} />}
              />
            </Row>
          </Button>
        </Space>
        <Divider style={{ margin: '8px 0 16px 0' }} />
        <SimpleBarStyle
          style={{ height: '100%', overflow: 'auto', color: 'white' }}
        >
          <Space
            direction='vertical'
            style={{ width: '100%', flexDirection: 'column-reverse' }}
            size={16}
          >
            {user?.callLogs.map(logId => (
              <CallListItem key={logId} logId={logId} />
            ))}
          </Space>
        </SimpleBarStyle>
      </Col>

      {/* Create New Call Popup */}
      <NewCallModal open={dialogOpen} handleCancel={handleCancel} />
    </>
  );
};

export default CallList;
