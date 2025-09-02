import { ArrowLeftOutlined } from '@ant-design/icons';
import useGetChatById from '@business/services/chat/useGetChatById.ts';
import GoBack from '@presentation/shared/ui/GoBack.tsx';
import { Layout, Typography } from 'antd';
import { FC, memo } from 'react';

const { Header } = Layout;
const { Text } = Typography;

type ChatHeaderProps = {
  chatId: string;
};

const ChatHeader: FC<ChatHeaderProps> = ({ chatId }) => {
  const { loading, error, data } = useGetChatById({
    id: chatId,
  });
  if (loading) {
    return <div>loading...</div>;
  }
  if (error || !data) {
    return <div>error...</div>;
  }
  return (
    <Header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
      <GoBack placeholder={<ArrowLeftOutlined />} route="/" />
      <Text className="text-xl">{data.name}</Text>
    </Header>
  );
};

const MemoizedChatHeader = memo(ChatHeader);

export default MemoizedChatHeader;
