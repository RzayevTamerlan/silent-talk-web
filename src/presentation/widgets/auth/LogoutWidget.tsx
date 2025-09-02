import useLogout from '@business/services/auth/useLogout.ts';
import { LogoutContractProvider } from '@presentation/contracts/auth/LogoutContract.tsx';
import type { FC, ReactNode } from 'react';
import { memo } from 'react';

type LogoutWidgetProps = {
  children: ReactNode;
};

const LogoutWidget: FC<LogoutWidgetProps> = ({ children }) => {
  const { logout } = useLogout();

  return <LogoutContractProvider logout={logout}>{children}</LogoutContractProvider>;
};

const MemoizedLogoutWidget = memo(LogoutWidget);

export default MemoizedLogoutWidget;
