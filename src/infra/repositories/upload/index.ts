import { http } from '@infra/api';
import { UploadResponseDto } from '@infra/dtos/upload/UploadResponseDto.ts';

const uploadVideo = async (formData: FormData): Promise<UploadResponseDto> => {
  return http({
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    url: '/upload/video',
  });
};

const uploadPhoto = async (formData: FormData): Promise<UploadResponseDto> => {
  return http({
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    url: '/upload/photo',
  });
};

const uploadDocument = async (formData: FormData): Promise<UploadResponseDto> => {
  return http({
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    url: '/upload/document',
  });
};

const uploadAudio = async (formData: FormData): Promise<UploadResponseDto> => {
  return http({
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    url: '/upload/audio',
  });
};

const uploadVoice = async (formData: FormData): Promise<UploadResponseDto> => {
  return http({
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    url: '/upload/voice',
  });
};

const uploadRepository = {
  uploadVideo,
  uploadPhoto,
  uploadDocument,
  uploadAudio,
  uploadVoice,
};

export default uploadRepository;
