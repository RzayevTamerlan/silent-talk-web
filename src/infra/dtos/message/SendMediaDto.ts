import { MediaType } from '@domain/enums/MediaType.ts';

export type SendMediaDto = {
  type: MediaType;
  url: string;
};
