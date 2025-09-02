import { MediaType } from '@domain/enums/MediaType.ts';
import { MessageType } from '@domain/enums/MessageType.ts';
import { z } from 'zod';

export const MediaValidationSchema = z.object({
  type: z.enum(MediaType),
  url: z.string({ message: 'URL медиафайла должен быть валидным.' }),
});

export const SendMessageValidationSchema = z
  .object({
    type: z.enum(MessageType),

    text: z
      .string()
      .min(0, { message: 'Текст сообщения не может быть пустым.' })
      .max(2000, { message: 'Текст сообщения не должен превышать 2000 символов.' })
      .optional(),

    replyToId: z
      .uuid({ message: 'ID сообщения для ответа должен быть в формате UUID.' })
      .optional(),

    medias: z.array(MediaValidationSchema).optional(),
  })
  .superRefine((data, ctx) => {
    const hasText = !!data.text && data.text.trim().length > 0;
    const hasMedia = !!data.medias && data.medias.length > 0;

    if (!hasText && !hasMedia) {
      ctx.addIssue({
        code: 'custom',
        message: 'Сообщение должно содержать либо текст, либо медиафайлы.',
        path: ['text'],
      });
    }
  });
