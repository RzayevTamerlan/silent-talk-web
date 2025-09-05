import { Children, cloneElement, FC, isValidElement, memo, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

type DeleteChatParamsManagerProps = {
  children: ReactNode;
  [key: string]: unknown;
};

const DeleteChatParamsManager: FC<DeleteChatParamsManagerProps> = ({ children, ...props }) => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('deleteChat') || undefined;

  console.log('Props in DeleteChatParamsManager:', props);

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

const MemoizedDeleteChatParamsManager = memo(DeleteChatParamsManager);

export default MemoizedDeleteChatParamsManager;
