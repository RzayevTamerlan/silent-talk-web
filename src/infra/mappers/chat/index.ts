import { Chat } from '@domain/entities/Chat.ts';
import { ChatDto } from '@infra/dtos/chat/ChatDto.ts';
import { UserMappers } from '@infra/mappers/user';

export class ChatMappers {
  static toDomain(dto: ChatDto): Chat {
    return {
      name: dto.name,
      maxUsers: dto.maxUsers,
      owner: dto?.owner ? UserMappers.toDomain(dto.owner) : undefined,
      createdAt: dto.createdAt,
      description: dto.description,
      id: dto.id,
      participants: dto?.participants ? dto.participants.map(UserMappers.toDomain) : [],
      updatedAt: dto.updatedAt,
    };
  }
}
