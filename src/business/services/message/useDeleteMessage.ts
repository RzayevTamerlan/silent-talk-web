import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { showToasts } from '@business/shared/utils/showToasts';
import { HttpError } from '@infra/api/HttpError';
import messageRepository from '@infra/repositories/messages';
import { useMutation } from '@tanstack/react-query';
import { dFunc } from 'd-func';

type UseDeleteMessageReturn = {
  loading: boolean;
  error: string[];
  deleteMessage: (messageId: string) => Promise<void>;
};

export type UseDeleteMessageProps = BaseServiceProps & {
  chatId?: string;
};

const useDeleteMessage = ({
  afterSuccess = dFunc,
  afterError = dFunc,
  showSuccessNotification = true,
  showErrorNotification = false,
  chatId = '',
}: UseDeleteMessageProps): UseDeleteMessageReturn => {
  const { error, isPending, mutateAsync, isError } = useMutation<void, HttpError, string>({
    mutationFn: async messageId => await messageRepository.deleteMessage(chatId, messageId),
    onSuccess: async () => {
      if (showSuccessNotification) showToasts('Сообщение успешно удалено!', 'success');
      if (afterSuccess) afterSuccess();
    },
    onError: async resError => {
      if (showErrorNotification) showToasts(resError.message, 'error');
      if (afterError) afterError();
    },
  });

  return {
    loading: isPending,
    deleteMessage: mutateAsync,
    error: isError ? error?.message : [],
  };
};

export default useDeleteMessage;
