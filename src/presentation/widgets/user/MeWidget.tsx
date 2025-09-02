import useGetMe from '@business/services/user/useGetMe';
import { MeContractProvider } from '@presentation/contracts/user/MeContract';
import { type FC, memo, type ReactNode } from 'react';

type MeWidgetProps = {
  children?: ReactNode;
};

const MeWidget: FC<MeWidgetProps> = ({ children }) => {
  const { loading, refetch, me, error } = useGetMe();

  return (
    <MeContractProvider error={error} loading={loading} me={me} refetch={refetch}>
      {children}
    </MeContractProvider>
  );
};

const MemoizedMeWidget = memo(MeWidget);

export default MemoizedMeWidget;
