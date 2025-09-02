import { ChangeAccessKeyDto } from '@infra/dtos/chat/ChangeAccessKeyDto.ts';
import { type BaseSyntheticEvent, createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export type ChangeAccessKeyContract = {
  loading: boolean;
  error: string[] | null;
  changeAccessKey: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<ChangeAccessKeyDto>;
};

const ChangeAccessKeyContractContext = createContext<ChangeAccessKeyContract | null>(null);

interface ChangeAccessKeyContractProviderProps extends ChangeAccessKeyContract {
  children: ReactNode;
}

export const ChangeAccessKeyContractProvider = memo(
  ({ children, ...value }: ChangeAccessKeyContractProviderProps) => {
    return (
      <ChangeAccessKeyContractContext.Provider value={value}>
        {children}
      </ChangeAccessKeyContractContext.Provider>
    );
  },
);

export const useChangeAccessKeyContract = () => {
  const context = useContext(ChangeAccessKeyContractContext);

  if (!context) {
    throw new Error(
      'useChangeAccessKeyContract must be used within a ChangeAccessKeyContractProvider',
    );
  }

  return context;
};
