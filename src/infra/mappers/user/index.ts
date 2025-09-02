import type { User } from '@domain/entities/User.ts';
import type { GetMeDto } from '@infra/dtos/user/GetMeDto.ts';
import { UserDto } from '@infra/dtos/user/UserDto.ts';

export class UserMappers {
  static mapGetMeDtoToDomain(dto: GetMeDto): User {
    return {
      id: dto.id,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      email: dto.email,
      username: dto.username,
    };
  }

  static toDomain(dto: UserDto): User {
    return {
      id: dto.id,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      email: dto.email,
      username: dto.username,
    };
  }
}
