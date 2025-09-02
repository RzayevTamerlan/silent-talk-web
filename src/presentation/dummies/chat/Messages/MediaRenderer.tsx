// src/presentation/components/chat/MediaRenderer.tsx (пример пути)
import { FileTextOutlined } from '@ant-design/icons';
import { Media } from '@domain/entities/Media.ts'; // Убедитесь, что тип Media импортирован
import { MediaType } from '@domain/enums/MediaType.ts';
import { FC, memo } from 'react';

type MediaRendererProps = {
  media: Media;
};

const MediaRenderer: FC<MediaRendererProps> = ({ media }) => {
  const getFileName = (url: string) => {
    try {
      const urlObject = new URL(url);
      const pathSegments = urlObject.pathname.split('/');
      return decodeURIComponent(pathSegments[pathSegments.length - 1]);
    } catch (_e) {
      console.log('Error parsing URL:', _e);
      return 'file'; // Fallback
    }
  };

  const mediaUrl = `${import.meta.env.VITE_BACKEND_URL}${media.url}`;

  switch (media.type) {
    case MediaType.IMAGE:
      return (
        <img
          src={mediaUrl}
          alt="image content"
          className="max-w-full max-h-80 rounded-lg object-cover"
        />
      );
    case MediaType.VIDEO:
      return <video src={mediaUrl} controls className="max-w-full max-h-80 rounded-lg" />;
    case MediaType.AUDIO: // Для обычных аудио-файлов, не голосовых
      return <audio src={mediaUrl} controls className="w-full" />;
    case MediaType.DOCUMENT:
      return (
        <a
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
        >
          <FileTextOutlined className="mr-2 text-2xl" />
          <span className="truncate">{getFileName(media.url)}</span>
        </a>
      );
    default:
      return null;
  }
};

const MemoizedMediaRenderer = memo(MediaRenderer);

export default MemoizedMediaRenderer;
