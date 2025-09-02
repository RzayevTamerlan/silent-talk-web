import useEnterChat from '@business/services/chat/useEnterChat';
import { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { EnterChatContractProvider } from '@presentation/contracts/chat/EnterChatContract.tsx';
import { type FC, memo, type ReactNode } from 'react';

type EnterChatWidgetProps = BaseServiceProps & {
  children: ReactNode;
  chatId?: string;
};

const EnterChatWidget: FC<EnterChatWidgetProps> = ({
  children,
  chatId = '',
  showSuccessNotification,
  showErrorNotification,
  clearForm,
  afterError,
  afterSuccess,
}) => {
  const { loading, enterChat, form, error } = useEnterChat({
    showSuccessNotification,
    showErrorNotification,
    afterSuccess,
    afterError,
    chatId,
    clearForm,
  });

  return (
    <EnterChatContractProvider enterChat={enterChat} form={form} error={error} loading={loading}>
      {children}
    </EnterChatContractProvider>
  );
};

const MemoizedEnterChatWidget = memo(EnterChatWidget);

export default MemoizedEnterChatWidget;
