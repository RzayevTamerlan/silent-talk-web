import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { showToasts } from '@business/shared/utils/showToasts';
import { UpdateChatValidationSchema } from '@business/validations/chat/UpdateChatValidationSchema.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { HttpError } from '@infra/api/HttpError';
import { UpdateChatDto } from '@infra/dtos/chat/UpdateChatDto.ts';
import chatRepository from '@infra/repositories/chat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dFunc } from 'd-func';
import type { BaseSyntheticEvent } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

type UseUpdateChatReturn = {
  loading: boolean;
  error: string[];
  updateChat: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<UpdateChatDto>;
};

export type UseUpdateChatProps = BaseServiceProps & {
  chatId?: string;
};

const useUpdateChat = ({
  afterSuccess = dFunc,
  afterError = dFunc,
  showSuccessNotification = true,
  showErrorNotification = false,
  chatId = '',
  clearForm = false,
}: UseUpdateChatProps): UseUpdateChatReturn => {
  const queryClient = useQueryClient();

  const { error, isPending, mutateAsync, isError } = useMutation<void, HttpError, UpdateChatDto>({
    mutationFn: async data => chatRepository.updateChat(chatId, data),
    onSuccess: async () => {
      if (showSuccessNotification) showToasts('Чат успешно создан!', 'success');
      if (afterSuccess) afterSuccess();
      await queryClient.invalidateQueries({
        queryKey: ['chats'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['chat-details', chatId],
      });
    },
    onError: async resError => {
      if (showErrorNotification) showToasts(resError.message, 'error');
      if (afterError) afterError();
    },
  });

  const form = useForm<UpdateChatDto>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(UpdateChatValidationSchema),
  });

  const handleSubmit = form.handleSubmit(async data => {
    await mutateAsync(data);
    if (clearForm) form.reset();
  });

  return {
    form,
    loading: isPending,
    updateChat: handleSubmit,
    error: isError ? error?.message : [],
  };
};

export default useUpdateChat;
