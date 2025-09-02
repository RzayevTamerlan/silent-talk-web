import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Chat } from '@domain/entities/Chat.ts';
import { Avatar, Card, Tag } from 'antd';
import { ElementType, FC, memo } from 'react';

type ChatItemProps = {
  chat: Chat;
  ActionSlot?: ElementType<{ chat: Chat }>;
};

const ChatItem: FC<ChatItemProps> = ({ chat, ActionSlot }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-white text-lg font-semibold mr-2">{chat.name}</h3>
            <Tag color="blue" className="bg-blue-900/20 border-blue-700 text-blue-300">
              <TeamOutlined className="mr-1" />
              {chat.maxUsers} макс.
            </Tag>
          </div>

          {chat.description && (
            <p className="text-gray-300 mb-3 line-clamp-2">{chat.description}</p>
          )}

          <div className="flex items-start gap-2 md:flex-row flex-col justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
              <span>Создатель: {chat?.owner?.username}</span>
            </div>

            <div>
              <span>Создан: {new Date(chat.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {ActionSlot && <ActionSlot chat={chat} />}
        </div>
      </div>
    </Card>
  );
};

const MemoizedChatItem = memo(ChatItem);

export default MemoizedChatItem;
