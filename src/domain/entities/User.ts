import type { BaseEntity } from '@domain/entities/BaseEntity';

export type User = BaseEntity & {
  email?: string;
  username: string;
};
