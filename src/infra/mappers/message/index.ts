import { Media } from '@domain/entities/Media.ts';
import { Message } from '@domain/entities/Message.ts';
import { MediaDto } from '@infra/dtos/message/MediaDto.ts';
import { MessageDto } from '@infra/dtos/message/MessageDto.ts';
import { UserMappers } from '@infra/mappers/user';

export class MessageMappers {
  static toDomain(dto: MessageDto): Message {
    return {
      chat: undefined,
      updatedAt: dto.updatedAt,
      type: dto.type,
      id: dto.id,
      text: dto.text,
      createdAt: dto.createdAt,
      medias: dto.medias?.map(MessageMappers.mediaToDomain) || [],
      replyTo: dto.replyTo ? MessageMappers.toDomain(dto.replyTo) : undefined,
      replies: [],
      user: dto.user ? UserMappers.toDomain(dto.user) : undefined!,
    };
  }

  static mediaToDomain(dto: MediaDto): Media {
    return {
      id: dto.id,
      type: dto.type,
      url: dto.url,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      message: undefined,
    };
  }
}
