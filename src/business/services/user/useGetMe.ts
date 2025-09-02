import type { Refetch } from '@business/shared/types/Refetch';
import type { User } from '@domain/entities/User';
import { HttpError } from '@infra/api/HttpError.ts';
import userRepository from '@infra/repositories/user';
import { useQuery } from '@tanstack/react-query';

type UseGetMeResponse = {
  me: User | undefined;
  error: HttpError | null;
  loading: boolean;
  refetch: Refetch<User>;
};

const useGetMe = (): UseGetMeResponse => {
  const { error, data, isLoading, refetch } = useQuery<User, HttpError, User>({
    queryKey: ['users', 'me'],
    queryFn: userRepository.getMe,
  });

  return {
    me: data,
    error,
    loading: isLoading,
    refetch,
  };
};

export default useGetMe;
