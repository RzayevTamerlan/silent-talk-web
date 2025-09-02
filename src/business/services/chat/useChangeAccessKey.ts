import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { showToasts } from '@business/shared/utils/showToasts';
import { ChangeAccessKeyValidationSchema } from '@business/validations/chat/ChangeAccessKeyValidationSchema.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { HttpError } from '@infra/api/HttpError';
import { ChangeAccessKeyDto } from '@infra/dtos/chat/ChangeAccessKeyDto.ts';
import chatRepository from '@infra/repositories/chat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dFunc } from 'd-func';
import type { BaseSyntheticEvent } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

type UseChangeAccessKeyReturn = {
  loading: boolean;
  error: string[];
  createChat: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<ChangeAccessKeyDto>;
};

export type UseChangeAccessKeyProps = BaseServiceProps & {
  chatId?: string;
};

const useChangeAccessKey = ({
  afterSuccess = dFunc,
  afterError = dFunc,
  showSuccessNotification = true,
  showErrorNotification = false,
  chatId = '',
  clearForm = false,
}: UseChangeAccessKeyProps): UseChangeAccessKeyReturn => {
  const queryClient = useQueryClient();

  const { error, isPending, mutateAsync, isError } = useMutation<
    void,
    HttpError,
    ChangeAccessKeyDto
  >({
    mutationFn: async data => chatRepository.changeAccessKey(chatId, data),
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

  const form = useForm<ChangeAccessKeyDto>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(ChangeAccessKeyValidationSchema),
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

export default useChangeAccessKey;
