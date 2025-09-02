import { Chat } from '@domain/entities/Chat.ts';
import { useIsParticipantContract } from '@presentation/contracts/chat/IsParticipantContract.tsx';
import { Button } from 'antd';
import { FC, memo, useCallback } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useVisibilityTarget } from 'react-visibility-manager';

type EnterChatModalActionProps = {
  className?: string;
  chat?: Chat;
};

const EnterChatModalAction: FC<EnterChatModalActionProps> = ({ className, chat }) => {
  const { loading, error, isParticipant } = useIsParticipantContract();
  const { set, isOpen } = useVisibilityTarget('enterChat');
  const [searchParams, setSearchParams] = useSearchParams();

  const handleOpenModal = useCallback(() => {
    if (isParticipant || !chat) return;

    const params = new URLSearchParams(searchParams);
    params.set('enterChatId', chat?.id || '');
    setSearchParams(params);
    set(true);
  }, [chat, isParticipant, searchParams, set, setSearchParams]);

  if (error && error.length > 0) {
    return <div className="text-red-500">Ошибка: {error.join(', ')}</div>;
  }

  if (!isParticipant) {
    return (
      <Button
        className={className}
        type="primary"
        onClick={handleOpenModal}
        loading={loading}
        disabled={loading || isParticipant || isOpen}
      >
        {isParticipant ? 'Вы в чате' : 'Войти в чат'}
      </Button>
    );
  } else {
    return (
      <NavLink to={`/chats/${chat?.id}`}>
        <Button className={className} color="cyan" variant="solid">
          Перейти в чат
        </Button>
      </NavLink>
    );
  }
};

const MemoizedEnterChatModalAction = memo(EnterChatModalAction);

export default MemoizedEnterChatModalAction;
