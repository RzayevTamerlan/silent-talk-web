import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { showToasts } from '@business/shared/utils/showToasts';
import { EnterChatValidationSchema } from '@business/validations/chat/EnterChatValidationSchema.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { HttpError } from '@infra/api/HttpError';
import { EnterChatDto } from '@infra/dtos/chat/EnterChatDto.ts';
import chatRepository from '@infra/repositories/chat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dFunc } from 'd-func';
import type { BaseSyntheticEvent } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type UseEnterChatReturn = {
  loading: boolean;
  error: string[];
  enterChat: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<EnterChatDto>;
};

export type UseEnterChatProps = BaseServiceProps & {
  chatId?: string;
  redirectUrl?: string;
};

const useEnterChat = ({
  afterSuccess = dFunc,
  afterError = dFunc,
  showSuccessNotification = true,
  showErrorNotification = false,
  chatId = '',
  clearForm = false,
  redirectUrl,
}: UseEnterChatProps): UseEnterChatReturn => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { error, isPending, mutateAsync, isError } = useMutation<void, HttpError, EnterChatDto>({
    mutationFn: async data => chatRepository.enterChat(chatId, data),
    onSuccess: async () => {
      if (showSuccessNotification) showToasts('Вы успешно вошли в чат!', 'success');
      if (afterSuccess) afterSuccess();
      await queryClient.invalidateQueries({
        queryKey: ['chats'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['is-participant', chatId],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['chat-details', chatId],
      });
      if (redirectUrl) navigate(redirectUrl);
    },
    onError: async resError => {
      if (showErrorNotification) showToasts(resError.message, 'error');
      if (afterError) afterError();
    },
  });

  const form = useForm<EnterChatDto>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(EnterChatValidationSchema),
  });

  const handleSubmit = form.handleSubmit(async data => {
    await mutateAsync(data);
    if (clearForm) form.reset();
  });

  return {
    form,
    loading: isPending,
    enterChat: handleSubmit,
    error: isError ? error?.message : [],
  };
};

export default useEnterChat;
