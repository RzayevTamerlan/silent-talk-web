import { CreateChatDto } from '@infra/dtos/chat/CreateChatDto.ts';
import { type BaseSyntheticEvent, createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export type CreateChatContract = {
  loading: boolean;
  error: string[] | null;
  createChat: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<CreateChatDto>;
};

const CreateChatContractContext = createContext<CreateChatContract | null>(null);

interface CreateChatContractProviderProps extends CreateChatContract {
  children: ReactNode;
}

export const CreateChatContractProvider = memo(
  ({ children, ...value }: CreateChatContractProviderProps) => {
    return (
      <CreateChatContractContext.Provider value={value}>
        {children}
      </CreateChatContractContext.Provider>
    );
  },
);

export const useCreateChatContract = () => {
  const context = useContext(CreateChatContractContext);

  if (!context) {
    throw new Error('useCreateChatContract must be used within a CreateChatContractProvider');
  }

  return context;
};
