import { BaseGetDto } from '@infra/dtos/common/BaseGetDto.ts';

export type GetMeDto = BaseGetDto & {
  email?: string;
  username: string;
};
