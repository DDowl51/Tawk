import { Form, Input } from 'antd';
import Modal from 'antd/es/modal/Modal';
import { FC, ChangeEventHandler, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { SetPrimaryColor } from 'store/settings/settings.action';
import { selectSettings } from 'store/settings/settings.slice';

type ThemeModalProps = {
  open: boolean;
  handleCancel: () => void;
};

const ThemeModal: FC<ThemeModalProps> = ({ open, handleCancel }) => {
  const handleOk = () => {
    dispatch(SetPrimaryColor(color));
    handleCancel();
  };
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useSelector(selectSettings);
  const [color, setColor] = useState(theme.colorPrimary);

  const handleChagnePrimaryColor: ChangeEventHandler<HTMLInputElement> = e => {
    setColor(e.target.value);
    console.log(e.target.value);
  };

  return (
    <Modal title='Theme' open={open} onCancel={handleCancel} onOk={handleOk}>
      <Form wrapperCol={{ span: 4 }}>
        <Form.Item initialValue={color} label='Theme color' name='theme-color'>
          <Input type='color' onChange={handleChagnePrimaryColor} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemeModal;
