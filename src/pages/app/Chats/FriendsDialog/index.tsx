import { Card, List, Modal } from 'antd';
import { FC } from 'react';
import FriendsItem from './FriendsItem';
import { ChatList as CHATLIST } from 'data';
import SimpleBarStyle from 'components/SimpleBarStyle';

type FriendsDialogProps = {
  open: boolean;
  handleCancel: () => void;
};

const FriendsDialog: FC<FriendsDialogProps> = ({ open, handleCancel }) => {
  return (
    <Modal title='Friends' open={open} onCancel={handleCancel} footer={null}>
      <SimpleBarStyle style={{ height: '60vh' }}>
        <List
          dataSource={CHATLIST}
          renderItem={item => (
            <Card bodyStyle={{ padding: 0 }}>
              <FriendsItem user={item} />
            </Card>
          )}
          split
        />
      </SimpleBarStyle>
    </Modal>
  );
};

export default FriendsDialog;
