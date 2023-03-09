import { Image, List } from 'antd';

import SimpleBarStyle from 'components/SimpleBarStyle';
import Message from './Message';
import { FC } from 'react';
import { MessageType } from 'types';

const MessageList: FC<{ enableMenu?: boolean; messages: MessageType[] }> = ({
  enableMenu = true,
  messages,
}) => {
  return (
    <SimpleBarStyle>
      <Image.PreviewGroup>
        <List
          style={{ height: '100%' }}
          dataSource={messages}
          renderItem={(item, idx) => (
            <Message key={idx} message={item} enableMenu={enableMenu} />
          )}
        />
      </Image.PreviewGroup>
    </SimpleBarStyle>
  );
};

export default MessageList;
