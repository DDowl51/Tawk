import Modal from 'antd/es/modal/Modal';
import { FC } from 'react';

type ThemeModalProps = {
  open: boolean;
  handleCancel: () => void;
};

const ThemeModal: FC<ThemeModalProps> = ({ open, handleCancel }) => {
  const handleOk = () => {
    handleCancel();
  };

  return (
    <Modal
      title='Theme'
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
    ></Modal>
  );
};

export default ThemeModal;
