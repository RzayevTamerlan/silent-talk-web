import { createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';

export type DeleteChatContract = {
  loading: boolean;
  error: string[] | null;
  deleteChat: (chatId: string) => Promise<void>;
};

const DeleteChatContractContext = createContext<DeleteChatContract | null>(null);

interface DeleteChatContractProviderProps extends DeleteChatContract {
  children: ReactNode;
}

export const DeleteChatContractProvider = memo(
  ({ children, ...value }: DeleteChatContractProviderProps) => {
    return (
      <DeleteChatContractContext.Provider value={value}>
        {children}
      </DeleteChatContractContext.Provider>
    );
  },
);

export const useDeleteChatContract = () => {
  const context = useContext(DeleteChatContractContext);

  if (!context) {
    throw new Error('useDeleteChatContract must be used within a DeleteChatContractProvider');
  }

  return context;
};
