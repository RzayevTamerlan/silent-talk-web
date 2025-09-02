import { PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { formatTime } from '@presentation/shared/utils/formatTime.ts';
import { Button } from 'antd';
import { FC, memo, useEffect, useRef, useState } from 'react';

type VoiceMessagePlayerProps = {
  url: string;
};

const VoiceMessagePlayer: FC<VoiceMessagePlayerProps> = ({ url }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Конструируем полный URL, чтобы избежать 404 ошибок
  const fullUrl = `${url}`;

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // --- НАЧАЛО: УЛУЧШЕННАЯ ЛОГИКА ПОЛУЧЕНИЯ ДЛИТЕЛЬНОСТИ ---

    // 1. Безопасная функция для установки длительности
    const setAudioData = () => {
      // Устанавливаем длительность, только если она является конечным, валидным числом
      if (audio && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleEnd = () => setIsPlaying(false);

    // 2. Добавляем более надежный слушатель 'durationchange'
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('durationchange', setAudioData); // <--- Ключевое изменение
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnd);

    // 3. Проверяем, не загружены ли данные уже (например, из кэша)
    // readyState > 0 означает, что метаданные (или больше) уже есть
    if (audio.readyState > 0) {
      setAudioData();
    }

    // Функция очистки (удаляем всех слушателей)
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('durationchange', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnd);
    };
    // --- КОНЕЦ: УЛУЧШЕННАЯ ЛОГИКА ---
  }, [fullUrl]); // Перезапускаем эффект, если URL изменился

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center w-full max-w-xs gap-2">
      <audio ref={audioRef} src={fullUrl} preload="metadata" />
      <Button
        type="text"
        shape="circle"
        onClick={togglePlayPause}
        icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
        className="text-2xl"
      />
      <div className="flex-grow bg-gray-500 bg-opacity-50 h-1 rounded-full">
        <div style={{ width: `${progress}%` }} className="bg-blue-400 h-1 rounded-full" />
      </div>
      <span className="text-xs font-mono w-20 text-right whitespace-nowrap">
        {formatTime(Math.floor(currentTime))} / {formatTime(Math.floor(duration))}
      </span>
    </div>
  );
};

const MemoizedVoiceMessagePlayer = memo(VoiceMessagePlayer);

export default MemoizedVoiceMessagePlayer;
