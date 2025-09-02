import { MessageOutlined } from '@ant-design/icons';
import { Chat } from '@domain/entities/Chat.ts';
import {
  GetAllChatsContract,
  useGetAllChatsContract,
} from '@presentation/contracts/chat/GetAllChatsContract.tsx';
import ChatItem from '@presentation/dummies/chat/ChatsList/ChatItem.tsx';
import { Alert, Card, List, Pagination, Spin } from 'antd';
import { ElementType, FC, memo } from 'react';

type ChatsListProps = {
  useContract?: () => GetAllChatsContract;
  ActionSlot?: ElementType<{ chat: Chat }>;
};

const ChatsList: FC<ChatsListProps> = ({ useContract = useGetAllChatsContract, ActionSlot }) => {
  const { loading, setPage, setLimit, error, data } = useContract();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка загрузки чатов"
        description={error.join(', ')}
        type="error"
        className="mb-4"
      />
    );
  }

  if (!data?.data?.length) {
    return (
      <Card className="bg-gray-800 border-gray-700 mt-8">
        <div className="text-center py-8">
          <MessageOutlined className="text-4xl text-gray-400 mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">Чаты не найдены</h3>
          <p className="text-gray-400">Создайте первый чат, чтобы начать общение</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <List
        itemLayout="vertical"
        size="large"
        dataSource={data.data}
        renderItem={chat => (
          <List.Item key={chat.id}>
            <ChatItem ActionSlot={ActionSlot} chat={chat} />
          </List.Item>
        )}
      />

      {data.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={data.currentPage}
            total={data.total}
            pageSize={data.currentLimit}
            onChange={setPage}
            onShowSizeChange={(_, newSize) => setLimit?.(newSize)}
            showSizeChanger={false}
            itemRender={(_page, _type, element) => <span className="text-gray-300">{element}</span>}
          />
        </div>
      )}
    </div>
  );
};

const MemoizedChatsList = memo(ChatsList);

export default MemoizedChatsList;
