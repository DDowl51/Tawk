import { Layout, Row, theme } from 'antd';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';

import Chat from './Chat';
import ChatList from './ChatList';

const Chats = () => {
  const { token } = theme.useToken();
  const {
    conversation: { currentSingleChatroomId },
  } = useSelector(selectData);

  // return (
  //   <Layout style={{ height: '100%' }}>
  //     <Layout.Sider
  //       style={{
  //         backgroundColor: token.colorBgLayout,
  //         boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
  //         height: '100vh',
  //       }}
  //       width={320}
  //     >
  //       <ChatList />
  //     </Layout.Sider>
  //     <Layout.Content>{currentSingleChatroomId && <Chat />}</Layout.Content>
  //   </Layout>
  // );
  return (
    <Row wrap={false} style={{ height: '100%' }}>
      <Row
        style={{
          backgroundColor: token.colorBgLayout,
          boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
          height: '100vh',
          width: 320,
          zIndex: 10,
        }}
      >
        <ChatList />
      </Row>
      {currentSingleChatroomId && <Chat />}
    </Row>
  );
};

export default Chats;
