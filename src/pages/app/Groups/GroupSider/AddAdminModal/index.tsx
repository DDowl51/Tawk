import { Modal, Skeleton, Transfer } from 'antd';
import useNotification from 'hooks/useNotification';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'store';
import { selectData } from 'store/data/data.slice';
import {
  useGetGroupUsersQuery,
  useSetGroupAdminsMutation,
} from 'store/services';
import { CloseAddAdminModal } from 'store/ui/ui.action';
import { selectUI } from 'store/ui/ui.slice';
import { User } from 'types';

const AddAdminModal = () => {
  const { addAdminModal } = useSelector(selectUI);
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const {
    conversation: { currentGroupChatroomId },
  } = useSelector(selectData);

  const { data, isLoading } = useGetGroupUsersQuery(
    currentGroupChatroomId || ''
  );
  const [admins, setAdmins] = useState<User[]>(data?.admins || []);
  const [setAdminRequest, result] = useSetGroupAdminsMutation();

  useEffect(() => {
    if (data) {
      setAdmins(data.admins);
    }
  }, [data]);

  const handleChange = (
    targetKeys: string[],
    direction: 'right' | 'left',
    moveKeys: string[]
  ) => {
    if (direction === 'left') {
      // 移除admin
      setAdmins(prev => prev.filter(u => !moveKeys.find(id => id === u._id)));
    } else {
      // 添加admin
      setAdmins(data!.users.filter(u => targetKeys.find(id => id === u._id)));
    }
  };

  const handleSubmit = async () => {
    try {
      await setAdminRequest({
        groupId: currentGroupChatroomId!,
        admins: admins.map(u => u._id),
      });
    } catch (error) {
      notify(error as any, 'error');
    } finally {
      dispatch(CloseAddAdminModal());
    }
  };

  return (
    <Modal
      open={addAdminModal.open}
      onCancel={() => dispatch(CloseAddAdminModal())}
      onOk={handleSubmit}
      confirmLoading={result.isLoading}
      title='Add or remove admins'
    >
      {isLoading ? (
        <Skeleton />
      ) : data ? (
        <Transfer
          rowKey={user => user._id}
          titles={['Users', 'Admins']}
          dataSource={data.users}
          targetKeys={admins.map(u => u._id)}
          render={user => user.name}
          onChange={handleChange}
        />
      ) : null}
    </Modal>
  );
};

export default AddAdminModal;
