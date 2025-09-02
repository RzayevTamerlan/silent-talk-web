import { BaseEntity } from '@domain/entities/BaseEntity.ts';
import { Chat } from '@domain/entities/Chat.ts';
import { Media } from '@domain/entities/Media.ts';
import { User } from '@domain/entities/User.ts';
import { MessageType } from '@domain/enums/MediaType.ts';

export type Message = BaseEntity & {
  type: MessageType;
  text?: string;
  medias?: Media[];
  replyTo?: Message;
  replies: Message[];
  user: User;
  chat?: Chat;
};
