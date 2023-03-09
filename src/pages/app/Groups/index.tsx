import { Layout, theme } from 'antd';
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
    <Layout style={{ height: '100%' }}>
      <Layout.Sider
        style={{
          backgroundColor: token.colorBgLayout,
          boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
        }}
        width={320}
      >
        <GroupList />
      </Layout.Sider>
      <Layout.Content>
        {chatroom && chatroom.type === 'group' && <GroupChat />}
      </Layout.Content>
    </Layout>
  );
};

export default Groups;
