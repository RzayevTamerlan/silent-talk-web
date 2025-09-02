import { HttpError } from '@infra/api/HttpError';
import { IsParticipantResponseDto } from '@infra/dtos/chat/IsParticipantResponseDto.ts';
import chatRepository from '@infra/repositories/chat';
import { useQuery } from '@tanstack/react-query';

type UseIsParticipantReturn = {
  loading: boolean;
  error: string[];
  isParticipant?: IsParticipantResponseDto;
};

type UseIsParticipantProps = {
  chatId: string;
};

const useIsParticipant = ({ chatId }: UseIsParticipantProps): UseIsParticipantReturn => {
  const { isPending, data, isError, error } = useQuery<
    IsParticipantResponseDto,
    HttpError,
    IsParticipantResponseDto
  >({
    queryKey: ['is-participant', chatId],
    queryFn: async () => await chatRepository.isParticipant(chatId),
    enabled: !!chatId,
  });

  return {
    loading: isPending,
    isParticipant: data,
    error: isError ? error?.message : [],
  };
};

export default useIsParticipant;
