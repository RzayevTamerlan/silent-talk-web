import { createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';

export type LeaveChatContract = {
  loading: boolean;
  error: string[] | null;
  leaveChat: (chatId: string) => Promise<void>;
};

const LeaveChatContractContext = createContext<LeaveChatContract | null>(null);

interface LeaveChatContractProviderProps extends LeaveChatContract {
  children: ReactNode;
}

export const LeaveChatContractProvider = memo(
  ({ children, ...value }: LeaveChatContractProviderProps) => {
    return (
      <LeaveChatContractContext.Provider value={value}>
        {children}
      </LeaveChatContractContext.Provider>
    );
  },
);

export const useLeaveChatContract = () => {
  const context = useContext(LeaveChatContractContext);

  if (!context) {
    throw new Error('useLeaveChatContract must be used within a LeaveChatContractProvider');
  }

  return context;
};
