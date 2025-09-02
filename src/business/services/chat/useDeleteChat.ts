import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { showToasts } from '@business/shared/utils/showToasts';
import { HttpError } from '@infra/api/HttpError';
import chatRepository from '@infra/repositories/chat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dFunc } from 'd-func';

type UseDeleteChatReturn = {
  loading: boolean;
  error: string[];
  deleteChat: (chatId: string) => Promise<void>;
};

export type UseDeleteChatProps = BaseServiceProps & {};

const useDeleteChat = ({
  afterSuccess = dFunc,
  afterError = dFunc,
  showSuccessNotification = true,
  showErrorNotification = false,
}: UseDeleteChatProps): UseDeleteChatReturn => {
  const queryClient = useQueryClient();

  const { error, isPending, mutateAsync, isError } = useMutation<void, HttpError, string>({
    mutationFn: chatRepository.deleteChat,
    onSuccess: async (_data, chatId) => {
      if (showSuccessNotification) showToasts('Чат успешно удалён', 'success');
      if (afterSuccess) afterSuccess();
      await queryClient.invalidateQueries({
        queryKey: ['chats'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['chat-details', chatId],
        exact: false,
      });
    },
    onError: async resError => {
      if (showErrorNotification) showToasts(resError.message, 'error');
      if (afterError) afterError();
    },
  });

  return {
    loading: isPending,
    deleteChat: mutateAsync,
    error: isError ? error?.message : [],
  };
};

export default useDeleteChat;
