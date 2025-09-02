import { createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';

export type IsParticipantContract = {
  loading: boolean;
  error: string[] | null;
  isParticipant?: boolean;
};

const IsParticipantContractContext = createContext<IsParticipantContract | null>(null);

interface IsParticipantContractProviderProps extends IsParticipantContract {
  children: ReactNode;
}

export const IsParticipantContractProvider = memo(
  ({ children, ...value }: IsParticipantContractProviderProps) => {
    return (
      <IsParticipantContractContext.Provider value={value}>
        {children}
      </IsParticipantContractContext.Provider>
    );
  },
);

export const useIsParticipantContract = () => {
  const context = useContext(IsParticipantContractContext);

  if (!context) {
    throw new Error('useIsParticipantContract must be used within a IsParticipantContractProvider');
  }

  return context;
};
