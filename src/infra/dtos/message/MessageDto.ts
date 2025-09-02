import { MessageType } from '@domain/enums/MessageType.ts';
import { BaseGetDto } from '@infra/dtos/common/BaseGetDto.ts';
import { MediaDto } from '@infra/dtos/message/MediaDto.ts';
import { UserDto } from '@infra/dtos/user/UserDto.ts';

export type MessageDto = BaseGetDto & {
  type: MessageType;
  text: string;
  medias: MediaDto[];
  replyTo: MessageDto;
  user: UserDto;
};
