import { z } from 'zod';

export const EditMessageValidationSchema = z.object({
  text: z
    .string()
    .min(1, { message: 'Текст сообщения не может быть пустым.' })
    .max(2000, { message: 'Текст сообщения не должен превышать 2000 символов.' }),
});
