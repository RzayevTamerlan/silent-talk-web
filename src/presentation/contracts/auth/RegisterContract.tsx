import { RegisterDto } from '@infra/dtos/auth/RegisterDto.ts';
import { type BaseSyntheticEvent, createContext, type ReactNode, useContext } from 'react';
import { memo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export type RegisterContract = {
  loading: boolean;
  error: string[] | null;
  signUp: (e?: BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<RegisterDto>;
};

const RegisterContractContext = createContext<RegisterContract | null>(null);

interface RegisterContractProviderProps extends RegisterContract {
  children: ReactNode;
}

export const RegisterContractProvider = memo(
  ({ children, ...value }: RegisterContractProviderProps) => {
    return (
      <RegisterContractContext.Provider value={value}>{children}</RegisterContractContext.Provider>
    );
  },
);

export const useRegisterContract = () => {
  const context = useContext(RegisterContractContext);

  if (!context) {
    throw new Error('useRegisterContract must be used within a RegisterContractProvider');
  }

  return context;
};
