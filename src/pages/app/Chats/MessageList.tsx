import { Image, List } from 'antd';

import { Chat_History } from 'data/index';
import SimpleBarStyle from 'components/SimpleBarStyle';
import Message from './Message';
import { FC } from 'react';

const MessageList: FC<{ enableMenu?: boolean }> = ({ enableMenu = true }) => {
  return (
    <SimpleBarStyle>
      <Image.PreviewGroup>
        <List
          style={{ height: '100%' }}
          dataSource={Chat_History}
          renderItem={(item, idx) => (
            <Message key={idx} message={item} enableMenu={enableMenu} />
          )}
        />
      </Image.PreviewGroup>
    </SimpleBarStyle>
  );
};

export default MessageList;
