import { http } from '@infra/api';
import { ChangeAccessKeyDto } from '@infra/dtos/chat/ChangeAccessKeyDto.ts';
import { ChatDto } from '@infra/dtos/chat/ChatDto.ts';
import { CreateChatDto } from '@infra/dtos/chat/CreateChatDto.ts';
import { EnterChatDto } from '@infra/dtos/chat/EnterChatDto.ts';
import { GetAllChatsQueryDto } from '@infra/dtos/chat/GetAllChatsQueryDto.ts';
import { IsParticipantResponseDto } from '@infra/dtos/chat/IsParticipantResponseDto.ts';
import { UpdateChatDto } from '@infra/dtos/chat/UpdateChatDto.ts';
import { PaginatedResult } from '@infra/dtos/common/PaginatedResult.ts';
import { ChatMappers } from '@infra/mappers/chat';

const createChat = async (dto: CreateChatDto): Promise<void> => {
  return http({
    method: 'POST',
    url: '/chats',
    data: dto,
  });
};

const updateChat = async (id: string, dto: UpdateChatDto): Promise<void> => {
  return http({
    method: 'PUT',
    url: `/chats/${id}`,
    data: dto,
  });
};

const deleteChat = async (id: string): Promise<void> => {
  return http({
    method: 'DELETE',
    url: `/chats/${id}`,
  });
};

const changeAccessKey = async (id: string, dto: ChangeAccessKeyDto): Promise<void> => {
  return http({
    method: 'PATCH',
    url: `/chats/${id}/access-key`,
    data: dto,
  });
};

const enterChat = async (chatId: string, dto: EnterChatDto): Promise<void> => {
  return http({
    method: 'POST',
    url: `/chats/${chatId}/enter`,
    data: dto,
  });
};

const leaveChat = async (chatId: string): Promise<void> => {
  return http({
    method: 'POST',
    url: `/chats/${chatId}/leave`,
  });
};

const getAllChats = async (dto: GetAllChatsQueryDto): Promise<PaginatedResult<ChatDto>> => {
  const res = await http<PaginatedResult<ChatDto>>({
    method: 'GET',
    params: dto,
    url: '/chats',
  });

  return res.data
    ? {
        ...res,
        data: res.data.map(ChatMappers.toDomain),
      }
    : res;
};

const getChatById = async (id: string): Promise<ChatDto> => {
  const res = await http<ChatDto>({
    method: 'GET',
    url: `/chats/${id}`,
  });

  return ChatMappers.toDomain(res);
};

const isParticipant = async (chatId: string): Promise<IsParticipantResponseDto> => {
  return http<IsParticipantResponseDto>({
    method: 'GET',
    url: `/chats/${chatId}/is-participant`,
  });
};

const chatRepository = {
  createChat,
  updateChat,
  deleteChat,
  changeAccessKey,
  enterChat,
  leaveChat,
  getAllChats,
  getChatById,
  isParticipant,
};

export default chatRepository;
