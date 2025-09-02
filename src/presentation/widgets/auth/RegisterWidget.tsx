import useRegister from '@business/services/auth/useRegister.ts';
import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps';
import { RegisterContractProvider } from '@presentation/contracts/auth/RegisterContract.tsx';
import { type FC, memo, type ReactNode } from 'react';

type RegisterWidgetProps = BaseServiceProps & {
  children: ReactNode;
  redirectUrl?: string;
};

const RegisterWidget: FC<RegisterWidgetProps> = ({ children, redirectUrl = '/' }) => {
  const { loading, signUp, form, error } = useRegister({
    redirectUrl: redirectUrl,
    showSuccessNotification: true,
    showErrorNotification: true,
    clearForm: true,
  });

  return (
    <RegisterContractProvider signUp={signUp} form={form} error={error} loading={loading}>
      {children}
    </RegisterContractProvider>
  );
};

const MemoizedRegisterWidget = memo(RegisterWidget);

export default MemoizedRegisterWidget;
