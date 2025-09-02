import { showToasts } from '@business/shared/utils/showToasts.ts';
import { deleteAccessToken } from '@infra/shared/utils/deleteAccessToken.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    deleteAccessToken();
    showToasts('Вы успешно вышли с аккаунта', 'success');
    await queryClient.invalidateQueries({
      queryKey: ['users'],
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: ['users'],
      exact: false,
    });
    queryClient.clear();
    navigate('/login');
  }, [navigate, queryClient]);

  return {
    logout: handleLogout,
  };
};

export default useLogout;
