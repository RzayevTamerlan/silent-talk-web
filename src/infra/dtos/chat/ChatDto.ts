import { BaseGetDto } from '@infra/dtos/common/BaseGetDto.ts';
import { UserDto } from '@infra/dtos/user/UserDto.ts';

export type ChatDto = BaseGetDto & {
  name: string;
  description?: string;
  maxUsers: number;
  owner?: UserDto;
  participants?: UserDto[];
};
