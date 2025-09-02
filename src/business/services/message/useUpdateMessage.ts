import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { showToasts } from '@business/shared/utils/showToasts';
import { EditMessageValidationSchema } from '@business/validations/message/EditMessageValidationSchema.ts';
import { Message } from '@domain/entities/Message.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { HttpError } from '@infra/api/HttpError';
import { UpdateMessageDto } from '@infra/dtos/message/UpdateMessageDto.ts';
import messageRepository from '@infra/repositories/messages';
import { useMutation } from '@tanstack/react-query';
import { dFunc } from 'd-func';
import { BaseSyntheticEvent, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

type UseEditMessageReturn = {
  loading: boolean;
  error: string[];
  updateMessage: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<UpdateMessageDto>;
  editMessage: Message | null;
  setEditMessage: (message: Message | null) => void;
};

export type UseEditMessageProps = BaseServiceProps & {
  chatId?: string;
};

const useEditMessage = ({
  afterSuccess = dFunc,
  afterError = dFunc,
  showSuccessNotification = true,
  showErrorNotification = false,
  clearForm = false,
  chatId = '',
}: UseEditMessageProps): UseEditMessageReturn => {
  const [editMessage, setEditMessage] = useState<Message | null>(null);

  const { error, isPending, mutateAsync, isError } = useMutation<void, HttpError, UpdateMessageDto>(
    {
      mutationFn: async dto =>
        await messageRepository.editMessage(chatId, editMessage?.id || '', dto.text),
      onSuccess: async () => {
        if (showSuccessNotification) showToasts('Сообщение успешно обновлено!', 'success');
        if (afterSuccess) afterSuccess();
      },
      onError: async resError => {
        if (showErrorNotification) showToasts(resError.message, 'error');
        if (afterError) afterError();
      },
    },
  );

  const form = useForm<UpdateMessageDto>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(EditMessageValidationSchema),
  });

  const handleSubmit = form.handleSubmit(async data => {
    if (!editMessage) {
      return;
    }
    await mutateAsync(data);
    if (clearForm) form.reset();
    setEditMessage(null);
  });

  return {
    form,
    loading: isPending,
    updateMessage: handleSubmit,
    error: isError ? error?.message : [],
    editMessage,
    setEditMessage,
  };
};

export default useEditMessage;
