import useCreateChat from '@business/services/chat/useCreateChat';
import { BaseServiceProps } from '@business/shared/types/ServicesGeneralProps.ts';
import { CreateChatContractProvider } from '@presentation/contracts/chat/CreateChatContract.tsx';
import { type FC, memo, type ReactNode } from 'react';

type CreateChatWidgetProps = BaseServiceProps & {
  children: ReactNode;
};

const CreateChatWidget: FC<CreateChatWidgetProps> = ({
  children,
  clearForm,
  showErrorNotification,
  showSuccessNotification,
  afterError,
  afterSuccess,
}) => {
  const { loading, createChat, form, error } = useCreateChat({
    showSuccessNotification,
    showErrorNotification,
    afterSuccess,
    afterError,
    clearForm,
  });

  return (
    <CreateChatContractProvider createChat={createChat} form={form} error={error} loading={loading}>
      {children}
    </CreateChatContractProvider>
  );
};

const MemoizedCreateChatWidget = memo(CreateChatWidget);

export default MemoizedCreateChatWidget;
