import useIsParticipant from '@business/services/chat/useIsParticipant';
import { IsParticipantContractProvider } from '@presentation/contracts/chat/IsParticipantContract.tsx';
import { type FC, memo, type ReactNode } from 'react';

type IsParticipantWidgetProps = {
  children: ReactNode;
  chatId?: string;
};

const IsParticipantWidget: FC<IsParticipantWidgetProps> = ({ children, chatId = '' }) => {
  const { loading, isParticipant, error } = useIsParticipant({
    chatId,
  });

  return (
    <IsParticipantContractProvider
      isParticipant={isParticipant && isParticipant.isParticipant}
      error={error}
      loading={loading}
    >
      {children}
    </IsParticipantContractProvider>
  );
};

const MemoizedIsParticipantWidget = memo(IsParticipantWidget);

export default MemoizedIsParticipantWidget;
