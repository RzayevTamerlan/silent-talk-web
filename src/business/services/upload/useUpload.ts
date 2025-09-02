import { showToasts } from '@business/shared/utils/showToasts.ts';
import { UploadResponseDto } from '@infra/dtos/upload/UploadResponseDto';
import uploadRepository from '@infra/repositories/upload';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

export type UploadType = 'photo' | 'video' | 'document' | 'audio' | 'voice';

const uploadConfig: Record<
  UploadType,
  {
    uploadFn: (formData: FormData) => Promise<UploadResponseDto>;
    formDataKey: string;
  }
> = {
  photo: { uploadFn: uploadRepository.uploadPhoto, formDataKey: 'photo' },
  video: { uploadFn: uploadRepository.uploadVideo, formDataKey: 'video' },
  document: { uploadFn: uploadRepository.uploadDocument, formDataKey: 'document' },
  audio: { uploadFn: uploadRepository.uploadAudio, formDataKey: 'audio' },
  voice: { uploadFn: uploadRepository.uploadVoice, formDataKey: 'voice' },
};

// Типизируем переменные, которые принимает наша мутация
type MutationVariables = {
  type: UploadType;
  fileFormData: FormData;
};

const useUpload = () => {
  const { isPending, mutateAsync, error } = useMutation<
    UploadResponseDto,
    Error,
    MutationVariables
  >({
    mutationFn: ({ type, fileFormData }) => {
      // Выбираем нужную функцию для загрузки из конфига
      const { uploadFn } = uploadConfig[type];
      return uploadFn(fileFormData);
    },
    onError: errorRes => {
      showToasts(errorRes.message, 'error');
    },
  });

  const handleUpload = useCallback(
    async (
      type: UploadType,
      file: File,
      inputSetter?: (url: string) => void,
    ): Promise<string | undefined> => {
      // Получаем правильный ключ для FormData из нашего конфига
      const { formDataKey } = uploadConfig[type];

      const formData = new FormData();
      formData.append(formDataKey, file);

      try {
        const res = await mutateAsync({ type, fileFormData: formData });
        if (inputSetter) {
          inputSetter(res.url);
        }

        return res.url;
      } catch (e) {
        // Ошибка уже обработана в onError мутации, но можно добавить доп. логику
        console.error('Upload failed:', e);
        showToasts('Upload failed. Please try again.', 'error');
        return undefined;
      }
    },
    [mutateAsync],
  );

  const handleMultipleUpload = useCallback(
    async (
      type: UploadType,
      files: File[],
      inputSetter?: (urls: string) => void,
    ): Promise<string | undefined> => {
      const { formDataKey } = uploadConfig[type];
      const uploadedUrls: string[] = [];

      try {
        for (const file of files) {
          const formData = new FormData();
          formData.append(formDataKey, file);
          const res = await mutateAsync({ type, fileFormData: formData });
          uploadedUrls.push(res.url);
        }

        const urlsString = uploadedUrls.join(',');

        if (inputSetter) {
          inputSetter(urlsString);
        }

        return urlsString;
      } catch (e) {
        showToasts('One or more uploads failed. Please try again.', 'error');
        console.error('Multiple upload failed:', e);
        return undefined;
      }
    },
    [mutateAsync],
  );

  return {
    isLoading: isPending,
    error: error?.message ?? null,
    handleUpload,
    handleMultipleUpload,
  };
};

export default useUpload;
