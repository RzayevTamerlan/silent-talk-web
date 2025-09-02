import useUpdateChat from '@business/services/chat/useUpdateChat';
import { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { UpdateChatContractProvider } from '@presentation/contracts/chat/UpdateChatContract.tsx';
import { type FC, memo, type ReactNode } from 'react';

type UpdateChatWidgetProps = BaseServiceProps & {
  children: ReactNode;
  chatId?: string;
};

const UpdateChatWidget: FC<UpdateChatWidgetProps> = ({
  children,
  chatId = '',
  showSuccessNotification,
  showErrorNotification,
  clearForm,
  afterError,
  afterSuccess,
}) => {
  const { loading, updateChat, form, error } = useUpdateChat({
    showSuccessNotification,
    showErrorNotification,
    afterSuccess,
    afterError,
    chatId,
    clearForm,
  });

  return (
    <UpdateChatContractProvider updateChat={updateChat} form={form} error={error} loading={loading}>
      {children}
    </UpdateChatContractProvider>
  );
};

const MemoizedUpdateChatWidget = memo(UpdateChatWidget);

export default MemoizedUpdateChatWidget;
