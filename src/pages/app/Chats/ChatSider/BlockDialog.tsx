import { Modal, Typography } from 'antd';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { SetSnackbar } from 'store/ui/ui.action';

type BlockDialogProps = {
  open: boolean;
  handleCancel: () => void;
};

const BlockDialog: FC<BlockDialogProps> = ({ open, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleBlock = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      handleCancel();
      dispatch(SetSnackbar(true, 'success', 'BLOCKED!!'));
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
