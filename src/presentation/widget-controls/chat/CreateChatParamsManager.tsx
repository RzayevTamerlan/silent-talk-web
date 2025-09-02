import { Children, cloneElement, FC, isValidElement, memo, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

type CreateChatParamsManagerProps = {
  children: ReactNode;
  [key: string]: unknown;
};

const CreateChatParamsManager: FC<CreateChatParamsManagerProps> = ({ children, ...props }) => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('enterChatId') || undefined;

  const childrenWithProps = Children.map(children, child => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        ...props,
        // @ts-expect-error Children first approach has bad type support
        chatId: chatId,
      });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
};

const MemoizedCreateChatParamsManager = memo(CreateChatParamsManager);

export default MemoizedCreateChatParamsManager;
