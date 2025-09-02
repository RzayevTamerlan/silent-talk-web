import { http } from '@infra/api';
import { RegisterDto } from '@infra/dtos/auth/RegisterDto.ts';
import type { SignInDto } from '@infra/dtos/auth/SignInDto.ts';
import type { SignInResponseDto } from '@infra/dtos/auth/SignInResponseDto';

const signIn = async (dto: SignInDto) => {
  return http<SignInResponseDto>({
    url: '/auth/login',
    method: 'POST',
    data: dto,
  });
};

const register = async (dto: RegisterDto): Promise<void> => {
  return http<void>({
    url: '/auth/register',
    method: 'POST',
    data: dto,
  });
};

const authRepository = {
  signIn,
  register,
};

export default authRepository;
