import useLogin from '@business/services/auth/useLogin.ts';
import type { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps';
import { LoginContractProvider } from '@presentation/contracts/auth/LoginContract.tsx';
import { type FC, memo, type ReactNode } from 'react';

type LoginWidgetProps = BaseServiceProps & {
  children: ReactNode;
  redirectUrl?: string;
};

const LoginWidget: FC<LoginWidgetProps> = ({ children, redirectUrl = '/' }) => {
  const { loading, signIn, form, error } = useLogin({
    redirectUrl: redirectUrl,
    showSuccessNotification: true,
    showErrorNotification: true,
    clearForm: true,
  });

  return (
    <LoginContractProvider signIn={signIn} form={form} error={error} loading={loading}>
      {children}
    </LoginContractProvider>
  );
};

const MemoizedLoginWidget = memo(LoginWidget);

export default MemoizedLoginWidget;
