import { Modal, Typography } from 'antd';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';

type BlockDialogProps = {
  open: boolean;
  handleCancel: () => void;
};

const BlockDialog: FC<BlockDialogProps> = ({ open, handleCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleBlock = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      handleCancel();
      toast.success('BLOCKED!!');
    }, 1500);
  };

  return (
    <Modal
      centered
      confirmLoading={loading}
      open={open}
      onCancel={handleCancel}
      onOk={handleBlock}
      title='Block this contact'
    >
      <Typography.Text>
        Are you sure you want to block this Contact?
      </Typography.Text>
    </Modal>
  );
};

export default BlockDialog;
