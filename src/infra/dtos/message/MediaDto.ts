import { MediaType } from '@domain/enums/MediaType.ts';
import { BaseGetDto } from '@infra/dtos/common/BaseGetDto.ts';

export type MediaDto = BaseGetDto & {
  type: MediaType;
  url: string;
};
