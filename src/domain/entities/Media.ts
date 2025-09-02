import { BaseEntity } from '@domain/entities/BaseEntity.ts';
import { Message } from '@domain/entities/Message.ts';
import { MediaType } from '@domain/enums/MediaType';

export type Media = BaseEntity & {
  type: MediaType;
  url: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
  message?: Message;
};
