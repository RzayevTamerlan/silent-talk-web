import type { EnterChatDto } from '@infra/dtos/chat/EnterChatDto.ts';
import { type BaseSyntheticEvent, createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export type EnterChatContract = {
  loading: boolean;
  error: string[] | null;
  enterChat: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<EnterChatDto>;
};

const EnterChatContractContext = createContext<EnterChatContract | null>(null);

interface EnterChatContractProviderProps extends EnterChatContract {
  children: ReactNode;
}

export const EnterChatContractProvider = memo(
  ({ children, ...value }: EnterChatContractProviderProps) => {
    return (
      <EnterChatContractContext.Provider value={value}>
        {children}
      </EnterChatContractContext.Provider>
    );
  },
);

export const useEnterChatContract = () => {
  const context = useContext(EnterChatContractContext);

  if (!context) {
    throw new Error('useEnterChatContract must be used within a EnterChatContractProvider');
  }

  return context;
};
