import { Image, List } from 'antd';

import SimpleBarStyle from 'components/SimpleBarStyle';
import Message from './Message';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';

const MessageList: FC<{ enableMenu?: boolean }> = ({ enableMenu = true }) => {
  const {
    conversation: { chatrooms, currentChatroomId },
  } = useSelector(selectData);
  const currentChatroom = chatrooms.find(
    room => room._id === currentChatroomId
  );
  console.log(chatrooms);
  return (
    <SimpleBarStyle>
      <Image.PreviewGroup>
        <List
          style={{ height: '100%' }}
          dataSource={currentChatroom?.messages}
          renderItem={(item, idx) => (
            <Message key={idx} message={item} enableMenu={enableMenu} />
          )}
        />
      </Image.PreviewGroup>
    </SimpleBarStyle>
  );
};

export default MessageList;
