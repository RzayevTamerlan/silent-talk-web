import { createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';

export type LogoutContract = {
  logout: () => Promise<void>;
};

const LogoutContractContext = createContext<LogoutContract | null>(null);

interface LogoutContractProviderProps extends LogoutContract {
  children: ReactNode;
}

export const LogoutContractProvider = memo(
  ({ children, ...value }: LogoutContractProviderProps) => {
    return (
      <LogoutContractContext.Provider value={value}>{children}</LogoutContractContext.Provider>
    );
  },
);

export const useLogoutContract = () => {
  const context = useContext(LogoutContractContext);

  if (!context) {
    throw new Error('useLogoutContract must be used within a LogoutContractProvider');
  }

  return context;
};
