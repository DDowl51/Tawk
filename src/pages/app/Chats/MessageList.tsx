import { Badge, Image, List, Space, theme } from 'antd';
import { useInView } from 'react-hook-inview';

import SimpleBarStyle from 'components/SimpleBarStyle';
import Message from './Message';
import { FC, useCallback, useEffect, useRef } from 'react';
import { MessageType } from 'types';
import { CaretDown } from 'phosphor-react';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/auth/auth.slice';

const MessageList: FC<{ enableMenu?: boolean; messages: MessageType[] }> = ({
  enableMenu = true,
  messages,
}) => {
  const { token } = theme.useToken();
  const { userId } = useSelector(selectAuth);
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    bottomDivRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  const [bottomRef, isVisible] = useInView({
    rootMargin: '20px',
  });

  const unreadCount = messages.reduce(
    (acc, msg) => (msg.read || msg.sender._id === userId ? acc : acc + 1),
    0
  );

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (isVisible) {
      scrollToBottom();
    }
  }, [scrollToBottom, messages.length, isVisible]);

  return (
    <>
      <SimpleBarStyle id='messageList'>
        <Image.PreviewGroup>
          <List
            style={{ height: '100%' }}
            dataSource={messages}
            renderItem={(item, idx) => (
              <div ref={idx === messages.length - 1 ? bottomRef : undefined}>
                <Message
                  key={item._id}
                  message={item}
                  enableMenu={enableMenu}
                />
              </div>
            )}
          />
        </Image.PreviewGroup>
        <div ref={bottomDivRef}></div>
      </SimpleBarStyle>

      {/* New message hint */}
      {!isVisible && unreadCount !== 0 && (
        <Space.Compact
          direction='vertical'
          style={{
            position: 'absolute',
            right: 50,
            bottom: 10,
            alignItems: 'center',
            backgroundColor: token.colorBgBase,
            justifyContent: 'center',
            borderRadius: 12,
            padding: 6,
            boxShadow: '2px 2px 8px  rgba(0, 0, 0, 0.25)',
            cursor: 'pointer',
          }}
          onClick={() => scrollToBottom()}
        >
          <Badge style={{ userSelect: 'none' }} count={unreadCount} />
          <CaretDown />
        </Space.Compact>
      )}
    </>
  );
};

export default MessageList;
