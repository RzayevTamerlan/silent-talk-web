import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { showToasts } from '@business/shared/utils/showToasts';
import { SendMessageValidationSchema } from '@business/validations/message/SendMessageValidationSchema.ts';
import { Message } from '@domain/entities/Message.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { HttpError } from '@infra/api/HttpError';
import { SendMessageDto } from '@infra/dtos/message/SendMessageDto.ts';
import messageRepository from '@infra/repositories/messages';
import { useMutation } from '@tanstack/react-query';
import { dFunc } from 'd-func';
import { BaseSyntheticEvent, Ref, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

type UseSendMessageReturn = {
  loading: boolean;
  error: string[];
  sendMessage: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<SendMessageDto>;
  replyMessage: Message | null;
  setReplyMessage: (message: Message | null) => void;
  sendMessageMutation: (dto: SendMessageDto) => Promise<void>;
};

export type UseSendMessageProps = BaseServiceProps & {
  chatId?: string;
  chatRef?: Ref<HTMLDivElement>;
};

const useSendMessage = ({
  afterSuccess = dFunc,
  afterError = dFunc,
  showSuccessNotification = true,
  showErrorNotification = false,
  clearForm = false,
  chatId = '',
  chatRef,
}: UseSendMessageProps): UseSendMessageReturn => {
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);

  const { error, isPending, mutateAsync, isError } = useMutation<void, HttpError, SendMessageDto>({
    mutationFn: async dto => await messageRepository.sendMessage(chatId, dto),
    onSuccess: async () => {
      if (showSuccessNotification) showToasts('Сообщение успешно отправлено!', 'success');
      if (afterSuccess) afterSuccess();
    },
    onError: async resError => {
      if (showErrorNotification) showToasts(resError.message, 'error');
      if (afterError) afterError();
    },
  });

  const form = useForm<SendMessageDto>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(SendMessageValidationSchema),
  });

  const handleSubmit = form.handleSubmit(async data => {
    if (chatRef && typeof chatRef !== 'function' && chatRef.current) {
      chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
    }
    console.log('Triggered', data);
    await mutateAsync({
      ...data,
      replyToId: replyMessage?.id,
    });
    if (clearForm) form.reset();
    setReplyMessage(null);
  });

  return {
    form,
    loading: isPending,
    sendMessage: handleSubmit,
    error: isError ? error?.message : [],
    replyMessage,
    setReplyMessage,
    sendMessageMutation: mutateAsync,
  };
};

export default useSendMessage;
