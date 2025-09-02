import type { Refetch } from '@business/shared/types/Refetch.ts';
import type { User } from '@domain/entities/User.ts';
import { HttpError } from '@infra/api/HttpError.ts';
import { createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';

export type MeContract = {
  loading: boolean;
  me: User | undefined;
  error: HttpError | null;
  refetch: Refetch<User>;
};

const MeContractContext = createContext<MeContract | null>(null);

interface MeContractProviderProps extends MeContract {
  children: ReactNode;
}

export const MeContractProvider = memo(({ children, ...value }: MeContractProviderProps) => {
  return <MeContractContext.Provider value={value}>{children}</MeContractContext.Provider>;
});

export const useMeContract = () => {
  const context = useContext(MeContractContext);

  if (!context) {
    throw new Error('useMeContract must be used within a MeContractProvider');
  }

  return context;
};
