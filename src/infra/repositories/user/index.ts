import type { User } from '@domain/entities/User';
import { http } from '@infra/api/index.js';
import type { GetMeDto } from '@infra/dtos/user/GetMeDto.ts';
import { UserMappers } from '@infra/mappers/user';

const getMe = async (): Promise<User> => {
  const res = await http<GetMeDto>({
    url: '/users/me',
    method: 'GET',
  });

  return UserMappers.mapGetMeDtoToDomain(res);
};

const userRepository = {
  getMe,
};

export default userRepository;
