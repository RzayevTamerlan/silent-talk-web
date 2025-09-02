import { z } from 'zod';

export const EnterChatValidationSchema = z.object({
  accessKey: z
    .string('Введите ключ доступа')
    .min(0, 'Ключ доступа не может быть отрицательной длины')
    .max(100, 'Ключ доступа должен содержать максимум 100 символов'),
});
