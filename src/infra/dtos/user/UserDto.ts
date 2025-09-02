import { BaseGetDto } from '@infra/dtos/common/BaseGetDto.ts';

export type UserDto = BaseGetDto & {
  username: string;
  email?: string;
};
