import { Layout, theme } from 'antd';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';
import AudioChat from './AudioChat';

import Chat from './Chat';
import ChatList from './ChatList';
import MediaContextProvider from './context/MediaContext';

const Chats = () => {
  const { token } = theme.useToken();
  const {
    conversation: { currentSingleChatroomId },
  } = useSelector(selectData);

  return (
    <>
      <Layout style={{ height: '100%' }}>
        <Layout.Sider
          style={{
            backgroundColor: token.colorBgLayout,
            boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
          }}
          width={320}
        >
          <ChatList />
        </Layout.Sider>
        <Layout.Content>{currentSingleChatroomId && <Chat />}</Layout.Content>
      </Layout>
    </>
  );
};

export default Chats;
