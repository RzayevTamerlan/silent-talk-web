import { UpdateChatDto } from '@infra/dtos/chat/UpdateChatDto.ts';
import { type BaseSyntheticEvent, createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export type UpdateChatContract = {
  loading: boolean;
  error: string[] | null;
  updateChat: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<UpdateChatDto>;
};

const UpdateChatContractContext = createContext<UpdateChatContract | null>(null);

interface UpdateChatContractProviderProps extends UpdateChatContract {
  children: ReactNode;
}

export const UpdateChatContractProvider = memo(
  ({ children, ...value }: UpdateChatContractProviderProps) => {
    return (
      <UpdateChatContractContext.Provider value={value}>
        {children}
      </UpdateChatContractContext.Provider>
    );
  },
);

export const useUpdateChatContract = () => {
  const context = useContext(UpdateChatContractContext);

  if (!context) {
    throw new Error('useUpdateChatContract must be used within a UpdateChatContractProvider');
  }

  return context;
};
