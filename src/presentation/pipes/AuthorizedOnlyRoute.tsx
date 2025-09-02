import useGetMe from '@business/services/user/useGetMe.ts';
import Fallback from '@presentation/shared/ui/Fallback.tsx';
import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type AuthorizedOnlyRouteProps = {
  children: ReactNode;
};

const AuthorizedOnlyRoute: FC<AuthorizedOnlyRouteProps> = ({ children }) => {
  const { loading, me, error } = useGetMe();

  if (loading)
    return (
      <div>
        <Fallback isFullScreen={true} />
      </div>
    );

  if (!me || error) return <Navigate to="/login" replace />;

  return <> {children}</>;
};

export default AuthorizedOnlyRoute;
