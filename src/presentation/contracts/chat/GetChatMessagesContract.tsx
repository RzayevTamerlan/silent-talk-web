import { InfiniteMessagesData } from '@business/services/message/useChatMessages.ts';
import { Message } from '@domain/entities/Message.ts';
import { HttpError } from '@infra/api/HttpError.ts';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { createContext, type ReactNode, RefObject, useContext } from 'react';
import { memo } from 'react';

export type GetChatMessagesContract = {
  loading: boolean;
  mutationLoading: boolean;
  error: string[] | null;
  messages?: Message[];
  setEditMessage: (message: Message | null) => void;
  setReplyToMessage: (message: Message | null) => void;
  handleDeleteMessage: (messageId: string) => Promise<void>;
  chatRef: RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  fetchMoreMessages: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<InfiniteMessagesData, HttpError>>;
};

const GetChatMessagesContractContext = createContext<GetChatMessagesContract | null>(null);

interface GetChatMessagesContractProviderProps {
  children: ReactNode;
  value: GetChatMessagesContract;
}

export const GetChatMessagesContractProvider = memo(
  ({ children, value }: GetChatMessagesContractProviderProps) => {
    return (
      <GetChatMessagesContractContext.Provider value={value}>
        {children}
      </GetChatMessagesContractContext.Provider>
    );
  },
);

export const useGetChatMessagesContract = () => {
  const context = useContext(GetChatMessagesContractContext);

  if (!context) {
    throw new Error(
      'useGetChatMessagesContract must be used within a GetChatMessagesContractProvider',
    );
  }

  return context;
};
