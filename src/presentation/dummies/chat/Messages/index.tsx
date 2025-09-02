import { ArrowDownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Message } from '@domain/entities/Message.ts';
import { MessageType } from '@domain/enums/MessageType.ts';
import { useGetChatMessagesContract } from '@presentation/contracts/chat/GetChatMessagesContract.tsx';
import { useMeContract } from '@presentation/contracts/user/MeContract.tsx';
import MediaRenderer from '@presentation/dummies/chat/Messages/MediaRenderer.tsx';
import VoiceMessagePlayer from '@presentation/dummies/chat/Messages/VoiceMessagePlayer.tsx';
import { Button, Dropdown, List, MenuProps, Typography } from 'antd';
import { FC, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EventBusProvider, useEmit, useEvent } from 'vibus-react';

const { Text } = Typography;

// Компонент ReplyPreview (без изменений)
type ReplyPreviewProps = {
  message: Message;
};
const ReplyPreview: FC<ReplyPreviewProps> = ({ message }) => {
  const emit = useEmit();

  return (
    <button
      onClick={() => emit(`scrollToMessage-${message.id}`, message.id)}
      className="mb-2 flex flex-col items-start p-2 border-l-4 border-blue-400 bg-black bg-opacity-20 rounded w-full"
    >
      <Text className="font-bold text-sm text-gray-300">
        {message?.user?.username || 'Not defined'}
      </Text>
      <p className="text-sm text-gray-400 truncate">
        {message.text?.substring(0, 25) || 'Медиафайл'}
      </p>
    </button>
  );
};

const ChatMessage = memo(({ item }: { item: Message }) => {
  const { me } = useMeContract();
  const { setEditMessage, setReplyToMessage, handleDeleteMessage, mutationLoading } =
    useGetChatMessagesContract();

  const isAuthor = useCallback((messageUserId: string) => me?.id === messageUserId, [me?.id]);

  const isCurrentUser = isAuthor(item.user.id);
  // Меню (без изменений)
  const menuItems: MenuProps['items'] = [
    {
      key: 'reply',
      disabled: mutationLoading,
      label: 'Ответить',
      onClick: () => setReplyToMessage(item),
    },
    {
      key: 'delete',
      label: 'Удалить',
      danger: true,
      disabled: mutationLoading,
      onClick: () => handleDeleteMessage(item.id),
    },
    ...(isCurrentUser
      ? [
          {
            key: 'edit',
            disabled: mutationLoading,
            label: 'Редактировать',
            onClick: () => setEditMessage(item),
          },
        ]
      : []),
  ];

  useEvent(`scrollToMessage-${item.id}`, (messageId: string) => {
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('bg-yellow-300');
      setTimeout(() => {
        element.classList.remove('bg-yellow-300');
      }, 2000);
    }
  });

  return (
    <List.Item
      id={item.id}
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} transition-all duration-300 !p-2 rounded-lg`}
      style={{ border: 'none', paddingBottom: '1rem' }}
    >
      <div className="flex items-start max-w-xl w-full">
        {!isCurrentUser && (
          <div className="mr-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
              {item.user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <div
          className={`relative p-3 rounded-lg w-full ${
            isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
          }`}
        >
          <div className="absolute top-1 right-1 z-10">
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Button
                type="text"
                shape="circle"
                icon={<EllipsisOutlined className="text-gray-400" />}
              />
            </Dropdown>
          </div>

          {item.replyTo && <ReplyPreview message={item.replyTo} />}

          <Text className={`font-bold ${isCurrentUser ? 'text-white' : 'text-gray-300'}`}>
            {isCurrentUser ? 'Вы' : item.user.username}
          </Text>

          {item.type === MessageType.VOICE && item.medias && item?.medias?.length > 0 ? (
            <div className="mt-2">
              <VoiceMessagePlayer
                url={`${import.meta.env.VITE_BACKEND_URL}${item.medias[0].url}`}
              />
            </div>
          ) : (
            <>
              {item.medias && item.medias.length > 0 && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.medias.map(media => (
                    <MediaRenderer key={media.id} media={media} />
                  ))}
                </div>
              )}
              {item.text && <p className="pr-8 whitespace-pre-wrap mt-1">{item.text}</p>}
            </>
          )}
          {/* --- КОНЕЦ: НОВАЯ ЛОГИКА РЕНДЕРИНГА КОНТЕНТА --- */}

          <Text className="text-xs text-gray-400 mt-2 block text-right">
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </div>
        {isCurrentUser && (
          <div className="ml-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              Я
            </div>
          </div>
        )}
      </div>
    </List.Item>
  );
});

const Messages = () => {
  const {
    loading: queryLoading,
    hasMore,
    messages,
    chatRef,
    fetchMoreMessages,
    isFetchingMore,
  } = useGetChatMessagesContract();
  const { loading } = useMeContract();

  console.log('Messages', messages);

  const [isScrolledUp, setIsScrolledUp] = useState<boolean>(false);

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatRef]);

  const prevScrollHeightRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!queryLoading && chatRef?.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [queryLoading, messages, chatRef]);

  useLayoutEffect(() => {
    if (prevScrollHeightRef.current && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = null;
    }
  }, [chatRef, messages]);

  useEffect(() => {
    const container = chatRef.current;

    const handleScroll = () => {
      if (!container) return;

      // Логика для подгрузки старых сообщений (без изменений)
      if (container.scrollTop === 0 && !isFetchingMore && hasMore) {
        prevScrollHeightRef.current = container.scrollHeight;
        fetchMoreMessages();
      }

      const scrollFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      if (scrollFromBottom > 300) {
        setIsScrolledUp(true);
      } else {
        setIsScrolledUp(false);
      }
    };

    container?.addEventListener('scroll', handleScroll);

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [chatRef, fetchMoreMessages, isFetchingMore, hasMore]);

  if (loading || queryLoading) {
    return <div className="flex-grow p-4 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div ref={chatRef} className="flex-grow p-4 overflow-y-auto relative">
      {isFetchingMore && (
        <div className="flex justify-center my-2">
          <p className="text-gray-400">Загрузка предыдущих сообщений...</p>
        </div>
      )}

      <EventBusProvider>
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={item => <ChatMessage key={item.id} item={item} />}
        />
      </EventBusProvider>

      {isScrolledUp && (
        <Button
          type="primary"
          shape="circle"
          icon={<ArrowDownOutlined />}
          className="fixed right-[32px] bottom-[90px] z-20 animate-fade-in"
          onClick={scrollToBottom}
        />
      )}
    </div>
  );
};

const MemoizedMessages = memo(Messages);

export default MemoizedMessages;
