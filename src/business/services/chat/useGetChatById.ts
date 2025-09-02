import type { Chat } from '@domain/entities/Chat';
import type { HttpError } from '@infra/api/HttpError';
import chatRepository from '@infra/repositories/chat';
import { useQuery } from '@tanstack/react-query';

type GetAllChatByIdProps = {
  id: string;
};

type UseGetAllChatsReturn = {
  error: string[] | null;
  data: Chat | undefined;
  loading: boolean;
};

const useGetAllChats = ({ id }: GetAllChatByIdProps): UseGetAllChatsReturn => {
  const { error, data, isLoading } = useQuery<Chat, HttpError, Chat>({
    queryKey: ['chats-details', id],
    queryFn: async () => await chatRepository.getChatById(id),
  });

  return {
    error: error ? error.message : null,
    data,
    loading: isLoading,
  };
};

export default useGetAllChats;
