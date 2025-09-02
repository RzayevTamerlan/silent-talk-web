import { memo } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

const MemoizedMainLayout = memo(MainLayout);

export default MemoizedMainLayout;
