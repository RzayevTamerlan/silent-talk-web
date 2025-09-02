import ChatHeader from '@presentation/dummies/chat/Chat/ChatHeader.tsx';
import Messages from '@presentation/dummies/chat/Messages';
import SendMessage from '@presentation/dummies/chat/Messages/SendMessage.tsx';
import ChatWidget from '@presentation/widgets/chat/ChatWidget.tsx';
import MeWidget from '@presentation/widgets/user/MeWidget';
import { Layout } from 'antd';
import { memo } from 'react';
import { useParams } from 'react-router-dom';

const { Content } = Layout;

const ChatPage = () => {
  const params = useParams();
  const chatId = params.chatId || '';

  return (
    <main>
      <Layout className="h-screen">
        <ChatHeader chatId={chatId} />
        <Layout>
          <Content className="flex flex-col">
            <MeWidget>
              <ChatWidget
                clearForm={true}
                chatId={chatId}
                showErrorNotification={true}
                showSuccessNotification={false}
              >
                <Messages />
                <SendMessage />
              </ChatWidget>
            </MeWidget>
          </Content>
        </Layout>
      </Layout>
    </main>
  );
};

const MemoizedChatPage = memo(ChatPage);

export default MemoizedChatPage;
