import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { showToasts } from '@business/shared/utils/showToasts';
import { HttpError } from '@infra/api/HttpError';
import chatRepository from '@infra/repositories/chat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dFunc } from 'd-func';

type UseLeaveChatReturn = {
  loading: boolean;
  error: string[];
  leaveChat: (chatId: string) => Promise<void>;
};

export type UseLeaveChatProps = BaseServiceProps & {};

const useLeaveChat = ({
  afterSuccess = dFunc,
  afterError = dFunc,
  showSuccessNotification = true,
  showErrorNotification = false,
}: UseLeaveChatProps): UseLeaveChatReturn => {
  const queryClient = useQueryClient();

  const { error, isPending, mutateAsync, isError } = useMutation<void, HttpError, string>({
    mutationFn: chatRepository.leaveChat,
    onSuccess: async (_data, chatId) => {
      if (showSuccessNotification) showToasts('Вы успешно покинули чат', 'success');
      if (afterSuccess) afterSuccess();
      await queryClient.invalidateQueries({
        queryKey: ['chats'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['chat-details', chatId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['is-participant', chatId],
      });
    },
    onError: async resError => {
      if (showErrorNotification) showToasts(resError.message, 'error');
      if (afterError) afterError();
    },
  });

  return {
    loading: isPending,
    leaveChat: mutateAsync,
    error: isError ? error?.message : [],
  };
};

export default useLeaveChat;
