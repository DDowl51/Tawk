import { Empty, Input, List, Modal } from 'antd';
import { FC, useState } from 'react';
import { User } from 'types';
import { SearchUsers } from 'requests';
import ResultItem from './ResultItem';

type AddFriendsDialogProps = {
  open: boolean;
  handleCancel: () => void;
};

const AddFriendDialog: FC<AddFriendsDialogProps> = ({ open, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<User[]>();

  const handleSearch = async (query: string) => {
    if (query.trim().length) {
      setLoading(true);
      const { users } = await SearchUsers(query);
      setResults(users);
      setLoading(false);
    }
  };

  return (
    <Modal title='Friends' open={open} onCancel={handleCancel} footer={null}>
      <Input.Search
        placeholder='Name or email'
        enterButton
        loading={loading}
        onSearch={handleSearch}
        style={{ marginBottom: 24 }}
      />
      {/* 1) Not even start searching, showing nothing */}

      {/* 2) Searched and returned results normally */}
      {results && results.length !== 0 && (
        <List
          dataSource={results}
          renderItem={item => <ResultItem user={item} />}
        />
      )}

      {/* 3) Searched and returned nothing, showing a "No result" */}
      {results && results.length === 0 && <Empty />}
    </Modal>
  );
};

export default AddFriendDialog;
