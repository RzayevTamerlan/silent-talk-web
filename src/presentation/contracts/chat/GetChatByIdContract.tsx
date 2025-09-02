import { Chat } from '@domain/entities/Chat.ts';
import { createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';

export type GetChatByIdContract = {
  loading: boolean;
  error: string[] | null;
  data?: Chat;
};

const GetChatByIdContractContext = createContext<GetChatByIdContract | null>(null);

interface GetChatByIdContractProviderProps extends GetChatByIdContract {
  children: ReactNode;
}

export const GetChatByIdContractProvider = memo(
  ({ children, ...value }: GetChatByIdContractProviderProps) => {
    return (
      <GetChatByIdContractContext.Provider value={value}>
        {children}
      </GetChatByIdContractContext.Provider>
    );
  },
);

export const useGetChatByIdContract = () => {
  const context = useContext(GetChatByIdContractContext);

  if (!context) {
    throw new Error('useGetChatByIdContract must be used within a GetChatByIdContractProvider');
  }

  return context;
};
