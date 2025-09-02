import type { SignInDto } from '@infra/dtos/auth/SignInDto.ts';
import { type BaseSyntheticEvent, createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export type LoginContract = {
  loading: boolean;
  error: string[] | null;
  signIn: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<SignInDto>;
};

const LoginContractContext = createContext<LoginContract | null>(null);

interface LoginContractProviderProps extends LoginContract {
  children: ReactNode;
}

export const LoginContractProvider = memo(({ children, ...value }: LoginContractProviderProps) => {
  return <LoginContractContext.Provider value={value}>{children}</LoginContractContext.Provider>;
});

export const useLoginContract = () => {
  const context = useContext(LoginContractContext);

  if (!context) {
    throw new Error('useLoginContract must be used within a LoginContractProvider');
  }

  return context;
};
