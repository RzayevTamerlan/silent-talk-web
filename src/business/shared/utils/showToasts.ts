import { toast, type TypeOptions } from 'react-toastify';
const DEFAULT_TOAST_DURATION = 3000;

export const showToasts = (
  message: string | string[],
  type: TypeOptions,
  ms: number = DEFAULT_TOAST_DURATION,
) => {
  if (Array.isArray(message)) {
    message.forEach(msg => {
      toast(msg, { type: type, autoClose: ms });
    });
    return;
  }

  toast(message, { type: type, autoClose: ms });
};
