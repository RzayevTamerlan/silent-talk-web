import { PaginationDto } from '@infra/dtos/common/PaginationDto.ts';

export type GetAllMessagesQueryDto = PaginationDto & {
  search?: string;
};
