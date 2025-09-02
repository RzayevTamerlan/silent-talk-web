import type { Chat } from '@domain/entities/Chat';
import type { HttpError } from '@infra/api/HttpError';
import { GetAllChatsQueryDto } from '@infra/dtos/chat/GetAllChatsQueryDto';
import type { PaginatedResult } from '@infra/dtos/common/PaginatedResult';
import chatRepository from '@infra/repositories/chat';
import { useQuery } from '@tanstack/react-query';

type GetAllQueryDto = {
  dto: GetAllChatsQueryDto;
};

type GetAllQueryResult = {
  error: string[] | null;
  data: PaginatedResult<Chat> | undefined;
  loading: boolean;
};

const useGetAllChats = ({ dto }: GetAllQueryDto): GetAllQueryResult => {
  const { error, data, isLoading } = useQuery<
    PaginatedResult<Chat>,
    HttpError,
    PaginatedResult<Chat>
  >({
    queryKey: ['chats', dto.page, dto.limit, dto.sortOrder, dto.search, dto.sortBy],
    queryFn: async () => await chatRepository.getAllChats(dto),
  });

  return {
    error: error ? error.message : null,
    data,
    loading: isLoading,
  };
};

export default useGetAllChats;
