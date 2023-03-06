import { Modal, Typography } from 'antd';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { SetSnackbar } from 'store/ui/ui.action';

type DeleteDialogProps = {
  open: boolean;
  handleCancel: () => void;
};

const DeleteDialog: FC<DeleteDialogProps> = ({ open, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleBlock = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      handleCancel();
      dispatch(SetSnackbar(true, 'success', 'DELETED!!'));
    }, 1500);
  };

  return (
    <Modal
      centered
      confirmLoading={loading}
      open={open}
      onCancel={handleCancel}
      onOk={handleBlock}
      title='Delete this contact'
      okButtonProps={{ danger: true }}
    >
      <Typography.Text>
        Are you sure you want to delete this Contact?
      </Typography.Text>
    </Modal>
  );
};

export default DeleteDialog;
