import { Layout, Row, theme } from 'antd';
import { useSelector } from 'react-redux';
import { selectData } from 'store/data/data.slice';
import GroupChat from './GroupChat';
import GroupList from './GroupList';

const Groups = () => {
  const { token } = theme.useToken();
  const {
    conversation: { currentGroupChatroomId, chatrooms },
  } = useSelector(selectData);
  const chatroom = chatrooms.find(room => room._id === currentGroupChatroomId)!;

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
        <GroupList />
      </Row>
      <Layout.Content>
        {chatroom && chatroom.type === 'group' && <GroupChat />}
      </Layout.Content>
    </Row>
  );
};

export default Groups;
