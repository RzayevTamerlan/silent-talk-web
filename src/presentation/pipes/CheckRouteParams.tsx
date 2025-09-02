import type { FC, ReactNode } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

interface CheckRouteParamsProps {
  requiredParams: string[];
  redirectTo?: string;
  children: ReactNode;
}

const CheckRouteParams: FC<CheckRouteParamsProps> = ({
  requiredParams,
  redirectTo = '/',
  children,
}) => {
  const [searchParams] = useSearchParams();

  const allValid = requiredParams.every(key => {
    const val = searchParams.get(key);
    return val !== null && val.trim() !== '';
  });

  if (!allValid) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default CheckRouteParams;
