import { Col, Row, theme, Typography } from 'antd';
import Modal from 'antd/es/modal/Modal';
import { FC } from 'react';
import Shortcut from 'components/Shortcuts';

type ShortcutModalProps = {
  open: boolean;
  handleCancel: () => void;
};

const list = [
  {
    key: 0,
    title: 'Mark as unread',
    combination: 'Ctrl+Shift+U',
  },
  {
    key: 1,
    title: 'Mute',
    combination: 'Ctrl+Shift+M',
  },
  {
    key: 2,
    title: 'Archive Chat',
    combination: 'Ctrl+Shift+E',
  },
  {
    key: 3,
    title: 'Delete Chat',
    combination: 'Ctrl+Shift+D',
  },
  {
    key: 4,
    title: 'Pin Chat',
    combination: 'Ctrl+Shift+P',
  },
  {
    key: 5,
    title: 'Search',
    combination: 'Ctrl+F',
  },
  {
    key: 6,
    title: 'Search Chat',
    combination: ['Cmd', 'Shift', 'F'],
  },
  {
    key: 7,
    title: 'Next Chat',
    combination: ['Cmd', 'N'],
  },
  {
    key: 8,
    title: 'Next Step',
    combination: ['Ctrl', 'Tab'],
  },
  {
    key: 9,
    title: 'Previous Step',
    combination: ['Ctrl', 'Shift', 'Tab'],
  },
  {
    key: 10,
    title: 'New Group',
    combination: 'Ctrl+Shift+N',
  },
  {
    key: 11,
    title: 'Profile & About',
    combination: 'Ctrl+P',
  },
  {
    key: 12,
    title: 'Increase speed of voice message',
    combination: 'Shift+.',
  },
  {
    key: 13,
    title: 'Decrease speed of voice message',
    combination: 'Shift+,',
  },
  {
    key: 14,
    title: 'Settings',
    combination: 'Shift+S',
  },
  {
    key: 15,
    title: 'Emoji Panel',
    combination: 'Ctrl+E',
  },
  {
    key: 16,
    title: 'Sticker Panel',
    combination: 'Ctrl+S',
  },
];

const ShortcutModal: FC<ShortcutModalProps> = ({ open, handleCancel }) => {
  const { token } = theme.useToken();

  return (
    <Modal
      centered
      title='Keyboard Shortcuts'
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1000}
    >
      <Row gutter={[32, 16]} style={{ marginTop: 32 }}>
        {list.map(item => (
          <Col key={item.key} span={12}>
            <Row justify='space-between' wrap={false} align='middle'>
              <Typography.Text style={{ fontWeight: 'bold' }}>
                {item.title}
              </Typography.Text>
              <div
                style={{
                  flex: 1,
                  margin: '0 10px',
                  border: `1px dashed ${token.colorBorder}`,
                }}
              />
              <Shortcut shortcut={item.combination} />
            </Row>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default ShortcutModal;
