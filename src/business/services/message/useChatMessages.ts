import { showToasts } from '@business/shared/utils/showToasts.ts';
import type { Message } from '@domain/entities/Message';
import { HttpError } from '@infra/api/HttpError.ts';
import { initializeSocket, socket } from '@infra/api/socket.ts';
import type { PaginatedResult } from '@infra/dtos/common/PaginatedResult';
import messageRepository from '@infra/repositories/messages';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Ref, useEffect, useLayoutEffect, useMemo } from 'react';

const MESSAGES_PER_PAGE = 25;
const SCROLL_THRESHOLD = 300;

export type InfiniteMessagesData = InfiniteData<PaginatedResult<Message>>;

const useChatMessages = (chatId: string, chatRef?: Ref<HTMLDivElement>) => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['chat-messages', chatId], [chatId]);

  const { data, error, fetchNextPage, hasNextPage, isLoading, isError, isFetchingNextPage } =
    useInfiniteQuery<PaginatedResult<Message>, HttpError, InfiniteMessagesData, string[], number>({
      queryKey: queryKey,
      queryFn: async ({ pageParam }) => {
        const res = await messageRepository.getAllMessages(chatId, {
          page: pageParam,
          limit: MESSAGES_PER_PAGE,
        });
        console.log('Messages in queryFn:', res);
        return res;
      },
      initialPageParam: 1,
      getNextPageParam: lastPage => {
        const hasMorePages = lastPage.currentPage < lastPage.totalPages;
        return hasMorePages ? lastPage.currentPage + 1 : undefined;
      },
      staleTime: 1,
    });

  console.log('Error in useChatMessages:', error);

  useEffect(() => {
    if (!socket) return;
    if (!chatId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const joinChatRoom = () => {
      console.log(`[Socket] Emitting 'join_chat' for chatId: ${chatId}`);

      if (!socket) return;
      socket.emit('join_chat', chatId);
    };

    if (socket.connected) {
      joinChatRoom();
    } else {
      socket.on('connect', joinChatRoom);
    }

    const handleNewMessage = (newMessage: Message) => {
      queryClient.setQueryData<InfiniteMessagesData>(queryKey, oldData => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page, index) => {
          if (index === 0) {
            return {
              ...page,
              data: [...page.data, newMessage],
            };
          }
          return page;
        });

        return {
          ...oldData,
          pages: newPages,
        };
      });
      const isNearBottom =
        chatRef && 'current' in chatRef && chatRef.current
          ? chatRef.current.scrollHeight -
              chatRef.current.scrollTop -
              chatRef.current.clientHeight <
            SCROLL_THRESHOLD
          : false;
      if (isNearBottom) {
        const scrollToBottom = () => {
          if (chatRef && 'current' in chatRef && chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        };
        setTimeout(scrollToBottom, 250);
      } else {
        showToasts('Пришло новое сообщение', 'info');
      }
    };

    const handleUpdatedMessage = (updatedMessage: Message) => {
      queryClient.setQueryData<InfiniteMessagesData>(queryKey, oldData => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map(page => ({
          ...page,
          data: page.data.map(msg => (msg.id === updatedMessage.id ? updatedMessage : msg)),
        }));
        return { ...oldData, pages: newPages };
      });
    };

    const handleDeletedMessage = (messageId: string) => {
      queryClient.setQueryData<InfiniteMessagesData>(queryKey, oldData => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map(page => ({
          ...page,
          data: page.data.filter(msg => msg.id !== messageId),
        }));
        return { ...oldData, pages: newPages };
      });
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_updated', handleUpdatedMessage);
    socket.on('message_deleted', handleDeletedMessage);

    return () => {
      if (!socket) return;
      socket.off('new_message', handleNewMessage);
      socket.off('message_updated', handleUpdatedMessage);
      socket.off('message_deleted', handleDeletedMessage);
      socket.emit('leave_chat', chatId);
      socket.off('connect', joinChatRoom);
    };
  }, [chatId, queryClient, queryKey, chatRef]);

  useLayoutEffect(() => {
    initializeSocket();
  }, []);

  console.log('Data pages in useChatMessages:', data?.pages);

  const messages = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages
      .slice()
      .reverse()
      .flatMap(page => page.data);
  }, [data]);

  console.log('useChatMessages messages', messages);

  return {
    messages,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useChatMessages;
