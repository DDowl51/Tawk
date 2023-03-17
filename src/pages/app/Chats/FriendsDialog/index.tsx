import { List, Modal, Tabs } from 'antd';
import { useState } from 'react';
import FriendsItem from './FriendsItem';
import SimpleBarStyle from 'components/SimpleBarStyle';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';
import RequestItem from './RequestItem';
import { selectUI } from 'store/ui/ui.slice';
import { useAppDispatch } from 'store';
import { CloseFriendsDialog } from 'store/ui/ui.action';

const tabItems = [
  {
    key: 'friends',
    label: 'Friends',
  },
  {
    key: 'requests',
    label: 'Requests',
  },
];

const FriendsList = () => {
  const { user } = useSelector(selectData);

  return (
    <List
      dataSource={user?.friends}
      renderItem={item => <FriendsItem userId={item} />}
      split
    />
  );
};

const RequestsList = () => {
  const { friendRequests } = useSelector(selectData);

  return (
    <List
      dataSource={friendRequests}
      renderItem={item => <RequestItem request={item} />}
      split
    />
  );
};

const FriendsDialog = () => {
  const [active, setActive] = useState('friends');
  const {
    friendsDialog: { open },
  } = useSelector(selectUI);
  const dispatch = useAppDispatch();

  return (
    <Modal
      title='Friends'
      open={open}
      onCancel={() => dispatch(CloseFriendsDialog())}
      footer={null}
    >
      <Tabs centered items={tabItems} onChange={setActive} />
      <SimpleBarStyle style={{ height: '60vh' }}>
        {(() => {
          switch (active) {
            case 'friends':
              return <FriendsList />;
            case 'requests':
              return <RequestsList />;
            default:
              return <FriendsList />;
          }
        })()}
      </SimpleBarStyle>
    </Modal>
  );
};

export default FriendsDialog;
