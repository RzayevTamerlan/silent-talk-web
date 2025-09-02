import { MessageType } from '@domain/enums/MessageType.ts';
import { SendMediaDto } from '@infra/dtos/message/SendMediaDto.ts';

export type SendMessageDto = {
  type: MessageType;
  text?: string;
  replyToId?: string;
  medias?: SendMediaDto[];
};
