import { http } from '@infra/api';
import { PaginatedResult } from '@infra/dtos/common/PaginatedResult.ts';
import { GetAllMessagesQueryDto } from '@infra/dtos/message/GetAllMessagesQueryDto.ts';
import { MessageDto } from '@infra/dtos/message/MessageDto.ts';
import { SendMessageDto } from '@infra/dtos/message/SendMessageDto.ts';
import { MessageMappers } from '@infra/mappers/message';

const sendMessage = async (chatId: string, dto: SendMessageDto): Promise<void> => {
  return http({
    method: 'POST',
    url: `/messages/${chatId}`,
    data: dto,
  });
};

const deleteMessage = async (chatId: string, messageId: string): Promise<void> => {
  return http({
    method: 'DELETE',
    url: `/messages/${chatId}/${messageId}`,
  });
};

const editMessage = async (chatId: string, messageId: string, text: string): Promise<void> => {
  return http({
    method: 'PATCH',
    url: `/messages/${chatId}/${messageId}`,
    data: {
      text,
    },
  });
};

const getAllMessages = async (chatId: string, dto: GetAllMessagesQueryDto) => {
  const res = await http<PaginatedResult<MessageDto>>({
    method: 'GET',
    url: `/messages/${chatId}`,
    params: dto,
  });

  console.log("Raw response data: ", res);

  const data = res.data.map(MessageMappers.toDomain);

  console.log("Converted data: ", data);

  return {
    ...res,
    data,
  };
};

const chatRepository = {
  sendMessage,
  deleteMessage,
  editMessage,
  getAllMessages,
};

export default chatRepository;
