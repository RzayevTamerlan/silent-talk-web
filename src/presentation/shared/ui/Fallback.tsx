import { cn } from '@presentation/shared/utils/cn.ts';
import { Spin } from 'antd';
import type { FC } from 'react';

type FallbackProps = {
  isFullScreen?: boolean;
  className?: string;
};
const Fallback: FC<FallbackProps> = ({ isFullScreen = true, className = '' }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        {
          'w-screen h-screen': isFullScreen,
        },
        className,
      )}
    >
      <Spin spinning={true} size="large" />
    </div>
  );
};

export default Fallback;
