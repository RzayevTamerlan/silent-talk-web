import { User } from '@domain/entities/User.ts';
import { BaseGetDto } from '@infra/dtos/common/BaseGetDto.ts';

export type Chat = BaseGetDto & {
  name: string;
  description?: string;
  maxUsers: number;
  owner?: User;
  participants?: User[];
};
