import { Layout } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUI } from 'store/ui/ui.slice';
import ContactInfo from './ContactInfo';
import SharedMessages from './SharedMessages';
import StarredMessages from './StarredMessages';

const ChatSider = () => {
  const { chatSider } = useSelector(selectUI);

  return (
    <Layout.Sider
      trigger={null}
      width={330}
      theme='light'
      collapsed={!chatSider.open}
      collapsedWidth={0}
      defaultCollapsed
      collapsible
      reverseArrow
      style={{
        boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
      }}
    >
      {(() => {
        switch (chatSider.type) {
          case 'contact':
            return <ContactInfo />;
          case 'shared':
            return <SharedMessages />;
          case 'starred':
            return <StarredMessages />;
          default:
            return <ContactInfo />;
        }
      })()}
    </Layout.Sider>
  );
};

export default ChatSider;
