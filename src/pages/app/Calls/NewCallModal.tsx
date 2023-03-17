import { FC } from 'react';
import { Input, Modal, Space } from 'antd';
import { MagnifyingGlass } from 'phosphor-react';

import { MembersList } from 'data';
import NewCallItem from './NewCallItem';
import SimpleBarStyle from 'components/SimpleBarStyle';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';

type NewCallModalType = {
  open: boolean;
  handleCancel: () => void;
};

const NewCallModal: FC<NewCallModalType> = ({ open, handleCancel }) => {
  const { user } = useSelector(selectData);

  return (
    <Modal open={open} onCancel={handleCancel} footer={null} title='Start Call'>
      <Input
        style={{ marginTop: 16, marginBottom: 16 }}
        size='large'
        placeholder='Search...'
        prefix={<MagnifyingGlass />}
      />
      <SimpleBarStyle style={{ height: 500 }}>
        <Space direction='vertical' size={8} style={{ width: '100%' }}>
          {user?.friends.map(f => (
            <NewCallItem key={f} userId={f} />
          ))}
        </Space>
      </SimpleBarStyle>
    </Modal>
  );
};

export default NewCallModal;
