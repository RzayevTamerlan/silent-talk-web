import { useDeleteChatContract } from '@presentation/contracts/chat/DeleteChatContract.tsx';
import { Alert, Button, Modal, Typography } from 'antd';
import { FC, memo, useCallback } from 'react';

const { Text, Paragraph } = Typography;

type DeleteChatModalProps = {
  isOpen?: boolean;
  onCancel?: () => void;
  chatId?: string;
};

const DeleteChatModal: FC<DeleteChatModalProps> = ({ isOpen, onCancel, chatId }) => {
  const { loading, deleteChat, error } = useDeleteChatContract();

  console.log('OnClose:', onCancel);

  const handleDelete = useCallback(async () => {
    if (!chatId) return;
    await deleteChat(chatId);
    onCancel?.();
  }, [chatId, deleteChat, onCancel]);

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      title="Удаление чата"
      centered
      destroyOnHidden={true}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" danger loading={loading} onClick={handleDelete}>
          Удалить
        </Button>,
      ]}
    >
      <div className="flex flex-col gap-4">
        <Paragraph>
          <Text className="text-gray-300">Вы уверены, что хотите удалить этот чат?</Text>
        </Paragraph>
        <Paragraph>
          <Text type="secondary">
            Это действие будет необратимым. Все сообщения и данные, связанные с этим чатом, будут
            навсегда удалены.
          </Text>
        </Paragraph>

        {error && error.length > 0 && (
          <Alert message="Ошибка при удалении" description={error} type="error" showIcon />
        )}
      </div>
    </Modal>
  );
};

const MemoizedDeleteChatModal = memo(DeleteChatModal);

export default MemoizedDeleteChatModal;
