import { Layout } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUI } from 'store/ui/ui.slice';
import ContactInfo from './ContactInfo';
import SharedMessages from './SharedMessages';
import StarredMessages from './StarredMessages';

const ChatSider = () => {
  const { chatSider } = useSelector(selectUI);

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
};

export default ChatSider;
