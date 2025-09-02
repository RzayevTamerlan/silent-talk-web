import { InfiniteMessagesData } from '@business/services/message/useChatMessages.ts';
import { UploadType } from '@business/services/upload/useUpload.ts';
import { Message } from '@domain/entities/Message.ts';
import { HttpError } from '@infra/api/HttpError.ts';
import { SendMessageDto } from '@infra/dtos/message/SendMessageDto.ts';
import { UpdateMessageDto } from '@infra/dtos/message/UpdateMessageDto.ts';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from '@tanstack/react-query';
import {
  type BaseSyntheticEvent,
  createContext,
  type ReactNode,
  RefObject,
  useContext,
} from 'react';
import { memo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export type ChatContractBase = {
  queryLoading: boolean;
  mutationLoading: boolean;
  messages: Message[];
  chatRef?: RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  fetchMoreMessages: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteMessagesData, HttpError>>;

  handleDeleteMessage: (messageId: string) => Promise<void>;
  handleMultipleUpload: (
    type: UploadType,
    files: File[],
    inputSetter?: (urls: string) => void,
  ) => Promise<string | undefined>;

  replyToMessage: Message | null;
  setReplyToMessage: (message: Message | null) => void;

  startRecording: () => void;
  setEditMessage: (message: Message | null) => void;
};

export type ChatDefaultMode = ChatContractBase & {
  mode: 'default';
  isRecording: false;
  editMessage: null;
  chatForm: UseFormReturn<SendMessageDto>;
  handleSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
};

export type ChatEditMode = ChatContractBase & {
  mode: 'edit';
  isRecording: false;
  editMessage: Message;
  chatForm: UseFormReturn<UpdateMessageDto>;
  handleSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  cancelEdit: () => void;
};

export type ChatVoiceMode = ChatContractBase & {
  mode: 'voice';
  isRecording: true;
  editMessage: null;
  recordingTimer: number;
  stopRecording: () => void;
  cancelRecording: () => void;
};

export type ChatContract = ChatDefaultMode | ChatEditMode | ChatVoiceMode;

const ChatContractContext = createContext<ChatContract | null>(null);

interface ChatContractProviderProps {
  children: ReactNode;
  value: ChatContract;
}

export const ChatContractProvider = memo(({ children, value }: ChatContractProviderProps) => {
  return <ChatContractContext.Provider value={value}>{children}</ChatContractContext.Provider>;
});

export const useChatContract = () => {
  const context = useContext(ChatContractContext);

  if (!context) {
    throw new Error('useChatContract must be used within a ChatContractProvider');
  }

  return context;
};
