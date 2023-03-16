import { Button, Image, List } from 'antd';
import toast from 'react-hot-toast';

import SimpleBarStyle from 'components/SimpleBarStyle';
import Message from './Message';
import { FC, useCallback, useRef } from 'react';
import { MessageType } from 'types';
import { useNavigate } from 'react-router';

const MessageList: FC<{ enableMenu?: boolean; messages: MessageType[] }> = ({
  enableMenu = true,
  messages,
}) => {
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    bottomDivRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <SimpleBarStyle>
      <Button type='link' onClick={() => toast.success('Hello')}>
        To Bottom
      </Button>
      <Image.PreviewGroup>
        <List
          style={{ height: '100%' }}
          dataSource={messages}
          renderItem={item => (
            <div id={item._id}>
              <Message key={item._id} message={item} enableMenu={enableMenu} />
            </div>
          )}
        />
      </Image.PreviewGroup>
      <div ref={bottomDivRef}></div>
    </SimpleBarStyle>
  );
};

export default MessageList;
