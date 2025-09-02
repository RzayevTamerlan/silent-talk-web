import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { showToasts } from '@business/shared/utils/showToasts';
import { CreateChatValidationSchema } from '@business/validations/chat/CreateChatValidationSchema.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { HttpError } from '@infra/api/HttpError';
import { CreateChatDto } from '@infra/dtos/chat/CreateChatDto.ts';
import chatRepository from '@infra/repositories/chat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dFunc } from 'd-func';
import type { BaseSyntheticEvent } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

type UseCreateChatReturn = {
  loading: boolean;
  error: string[];
  createChat: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<CreateChatDto>;
};

export type UseCreateChatProps = BaseServiceProps & {};

const useCreateChat = ({
  afterSuccess = dFunc,
  afterError = dFunc,
  showSuccessNotification = true,
  showErrorNotification = false,
  clearForm = false,
}: UseCreateChatProps): UseCreateChatReturn => {
  const queryClient = useQueryClient();
  const { error, isPending, mutateAsync, isError } = useMutation<void, HttpError, CreateChatDto>({
    mutationFn: chatRepository.createChat,
    onSuccess: async () => {
      if (showSuccessNotification) showToasts('Чат успешно создан!', 'success');
      if (afterSuccess) afterSuccess();
      await queryClient.invalidateQueries({
        queryKey: ['chats'],
        exact: false,
      });
    },
    onError: async resError => {
      if (showErrorNotification) showToasts(resError.message, 'error');
      if (afterError) afterError();
    },
  });

  const form = useForm<CreateChatDto>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(CreateChatValidationSchema),
  });

  const handleSubmit = form.handleSubmit(async data => {
    await mutateAsync(data);
    if (clearForm) form.reset();
  });

  return {
    form,
    loading: isPending,
    createChat: handleSubmit,
    error: isError ? error?.message : [],
  };
};

export default useCreateChat;
