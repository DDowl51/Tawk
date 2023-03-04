import { List } from 'antd';

import { Chat_History } from '../../../data/index';
import SimpleBarStyle from '../../../components/SimpleBarStyle';
import Message from './Message';

const MessageList = () => {
  return (
    <SimpleBarStyle>
      <List
        style={{ height: '100%' }}
        dataSource={Chat_History}
        renderItem={(item, idx) => <Message key={idx} message={item} />}
      />
    </SimpleBarStyle>
  );
};

export default MessageList;
