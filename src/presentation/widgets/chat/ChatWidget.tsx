import useChatMessages from '@business/services/message/useChatMessages.ts';
import useDeleteMessage from '@business/services/message/useDeleteMessage.ts';
import useSendMessage from '@business/services/message/useSendMessage.ts';
import useEditMessage from '@business/services/message/useUpdateMessage.ts';
import useVoiceRecording from '@business/services/message/useVoiceRecording.ts';
import useUpload from '@business/services/upload/useUpload.ts';
import { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { Message } from '@domain/entities/Message.ts';
import {
  ChatContract,
  ChatContractProvider,
  ChatDefaultMode,
  ChatEditMode,
  ChatVoiceMode,
} from '@presentation/contracts/chat/ChatContract.tsx';
import { GetChatMessagesContractProvider } from '@presentation/contracts/chat/GetChatMessagesContract.tsx';
import useIsAtBottom from '@presentation/shared/hooks/useIsAtBottom.ts';
import { type FC, memo, type ReactNode, useCallback, useMemo, useRef, useState } from 'react';

type ChatWidgetProps = BaseServiceProps & {
  children: ReactNode;
  chatId?: string;
};

type ChatMode = 'default' | 'edit' | 'voice';

const ChatWidget: FC<ChatWidgetProps> = ({
  children,
  clearForm,
  showErrorNotification,
  showSuccessNotification,
  afterError,
  afterSuccess,
  chatId = '',
}) => {
  const [mode, setMode] = useState<ChatMode>('default');
  const chatRef = useRef<HTMLDivElement>(null);

  // --- Инициализация всех хуков ---
  const { isAtBottom } = useIsAtBottom({ ref: chatRef, threshold: 300 });

  const { messages, isFetchingNextPage, hasNextPage, fetchNextPage } = useChatMessages(
    chatId,
    chatRef,
  );

  const {
    loading: sendingMessageLoading,
    form: sendMessageForm,
    sendMessage,
    setReplyMessage,
    replyMessage,
    sendMessageMutation,
  } = useSendMessage({
    chatId,
    clearForm,
    showErrorNotification,
    showSuccessNotification,
    afterError,
    afterSuccess,
    chatRef,
  });

  const {
    loading: editingMessageLoading,
    form: editForm,
    updateMessage,
    setEditMessage: setEditMessageFromHook, // Переименовываем, чтобы избежать конфликта
    editMessage,
  } = useEditMessage({
    chatId,
    clearForm,
    showErrorNotification,
    showSuccessNotification,
    afterError,
    afterSuccess,
  });

  const { loading: deleteLoading, deleteMessage } = useDeleteMessage({
    chatId,
    showErrorNotification,
    showSuccessNotification,
    afterError,
    afterSuccess,
  });

  const { handleMultipleUpload, isLoading: uploadLoading } = useUpload();

  const {
    startRecording: startRecordingFromHook,
    stopRecording: stopRecordingFromHook,
    recordingTimer,
    isUploading,
    cancelRecording: cancelRecordingFromHook,
  } = useVoiceRecording({ createNewMessage: sendMessageMutation });

  // --- Обертки для управления режимами ---
  const handleSetEditMessage = useCallback(
    (message: Message | null) => {
      setEditMessageFromHook(message);
      setMode(message ? 'edit' : 'default');
    },
    [setEditMessageFromHook],
  );

  const cancelEdit = useCallback(() => {
    handleSetEditMessage(null);
  }, [handleSetEditMessage]);

  const handleStartRecording = useCallback(() => {
    startRecordingFromHook();
    setMode('voice');
  }, [startRecordingFromHook]);

  const handleStopRecording = useCallback(() => {
    stopRecordingFromHook();
    setMode('default');
  }, [stopRecordingFromHook]);

  const cancelRecording = useCallback(() => {
    cancelRecordingFromHook();
    setMode('default');
  }, [cancelRecordingFromHook]);

  // --- Сборка объекта контекста с помощью useMemo ---
  const contractValue = useMemo((): ChatContract => {
    const mutationLoading =
      sendingMessageLoading ||
      editingMessageLoading ||
      uploadLoading ||
      isUploading ||
      deleteLoading;

    // 1. Базовый объект, общий для всех режимов
    const baseContract = {
      mutationLoading,
      chatRef,
      handleDeleteMessage: deleteMessage,
      handleMultipleUpload,
      replyToMessage: replyMessage,
      setReplyToMessage: setReplyMessage,
      // Функции-переключатели
      setEditMessage: handleSetEditMessage,
      startRecording: handleStartRecording,
    };

    // 2. Добавляем специфичные для режима свойства
    if (mode === 'edit' && editMessage) {
      return {
        ...baseContract,
        mode: 'edit',
        isRecording: false,
        editMessage,
        chatForm: editForm,
        handleSubmit: updateMessage,
        cancelEdit,
      } as ChatEditMode;
    }

    if (mode === 'voice') {
      return {
        ...baseContract,
        mode: 'voice',
        isRecording: true,
        editMessage: null,
        recordingTimer,
        stopRecording: handleStopRecording,
        cancelRecording,
      } as ChatVoiceMode;
    }

    // 3. Режим по умолчанию
    return {
      ...baseContract,
      mode: 'default',
      isRecording: false,
      editMessage: null,
      chatForm: sendMessageForm,
      handleSubmit: sendMessage,
    } as ChatDefaultMode;
  }, [
    mode,
    sendingMessageLoading,
    editingMessageLoading,
    uploadLoading,
    isUploading,
    deleteLoading,
    deleteMessage,
    handleMultipleUpload,
    replyMessage,
    setReplyMessage,
    editMessage,
    editForm,
    updateMessage,
    handleStopRecording,
    cancelRecording,
    handleSetEditMessage,
    handleStartRecording,
    cancelEdit,
    recordingTimer,
    sendMessageForm,
    sendMessage,
  ]);

  const getChatMessagesContractValue = useMemo(
    () => ({
      loading: isFetchingNextPage, // Объединяем состояния загрузки
      chatRef,
      setReplyToMessage: setReplyMessage,
      setEditMessage: handleSetEditMessage,
      messages,
      mutationLoading:
        sendingMessageLoading ||
        editingMessageLoading ||
        uploadLoading ||
        isUploading ||
        deleteLoading,
      handleDeleteMessage: deleteMessage,
      isAtBottom,
      isFetchingMore: isFetchingNextPage,
      hasMore: hasNextPage,
      fetchMoreMessages: fetchNextPage,
      error: null,
    }),
    [
      isFetchingNextPage,
      chatRef,
      setReplyMessage,
      handleSetEditMessage,
      messages,
      sendingMessageLoading,
      editingMessageLoading,
      uploadLoading,
      isUploading,
      deleteLoading,
      deleteMessage,
      isAtBottom,
      hasNextPage,
      fetchNextPage,
    ],
  );

  console.log('Messages in Chat Widget:', messages);

  return (
    <GetChatMessagesContractProvider value={getChatMessagesContractValue}>
      <ChatContractProvider value={contractValue}>{children}</ChatContractProvider>
    </GetChatMessagesContractProvider>
  );
};

const MemoizedChatWidget = memo(ChatWidget);

export default MemoizedChatWidget;
