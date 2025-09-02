import { getAccessToken } from '@infra/shared/utils/getAccessToken';
import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type UnAuthorizedOnlyRouteProps = {
  children: ReactNode;
};

const UnAuthorizedOnlyRoute: FC<UnAuthorizedOnlyRouteProps> = ({ children }) => {
  const accessToken = getAccessToken();

  if (accessToken) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default UnAuthorizedOnlyRoute;
