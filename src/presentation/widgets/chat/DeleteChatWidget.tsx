import useDeleteChat from '@business/services/chat/useDeleteChat';
import { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { DeleteChatContractProvider } from '@presentation/contracts/chat/DeleteChatContract.tsx';
import { type FC, memo, type ReactNode } from 'react';

type DeleteChatWidgetProps = BaseServiceProps & {
  children: ReactNode;
};

const DeleteChatWidget: FC<DeleteChatWidgetProps> = ({
  children,
  showErrorNotification,
  showSuccessNotification,
  afterError,
  afterSuccess,
}) => {
  const { loading, deleteChat, error } = useDeleteChat({
    showSuccessNotification,
    showErrorNotification,
    afterSuccess,
    afterError,
  });

  return (
    <DeleteChatContractProvider deleteChat={deleteChat} error={error} loading={loading}>
      {children}
    </DeleteChatContractProvider>
  );
};

const MemoizedDeleteChatWidget = memo(DeleteChatWidget);

export default MemoizedDeleteChatWidget;
