import { PaginationDto } from '@infra/dtos/common/PaginationDto.ts';

export type GetAllChatsQueryDto = PaginationDto & {
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'maxUsers';
  sortOrder?: 'asc' | 'desc';
};
