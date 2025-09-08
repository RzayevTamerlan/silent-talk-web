import { PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { formatTime } from '@presentation/shared/utils/formatTime.ts';
import { Button, Slider } from 'antd';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';

type VoiceMessagePlayerProps = {
  url: string;
};

const AVAILABLE_SPEEDS: number[] = [1, 1.5, 2];

const VoiceMessagePlayer: FC<VoiceMessagePlayerProps> = ({ url }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(AVAILABLE_SPEEDS[0]);

  const fullUrl = `${url}`;

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.playbackRate = playbackRate;
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, playbackRate]);

  const togglePlaybackSpeed = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentIndex = AVAILABLE_SPEEDS.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % AVAILABLE_SPEEDS.length;
    const newSpeed = AVAILABLE_SPEEDS[nextIndex];

    setPlaybackRate(newSpeed);
    audio.playbackRate = newSpeed;
  }, [playbackRate]);

  const handleSeek = useCallback((value: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value;
      setCurrentTime(value);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const updateCurrentTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0); // Сбрасываем время на начало
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('durationchange', setAudioData);
    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('ended', handleEnd);

    if (audio.readyState > 0) {
      setAudioData();
    }

    // Синхронизируем скорость воспроизведения
    audio.playbackRate = playbackRate;

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('durationchange', setAudioData);
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [fullUrl, playbackRate]);

  return (
    <div className="flex flex-col w-full max-w-xs gap-2">
      <div className="flex items-center gap-2">
        <audio ref={audioRef} src={fullUrl} preload="metadata" />
        <Button
          type="text"
          shape="circle"
          onClick={togglePlayPause}
          icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
          className="text-2xl"
        />
        <Slider
          min={0}
          max={duration}
          value={currentTime}
          step={1}
          onChange={handleSeek}
          tooltip={{ formatter: null }}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between">
        <Button type="text" onClick={togglePlaybackSpeed} className="w-12 text-center font-mono">
          {playbackRate}x
        </Button>
        <span className="text-xs font-mono w-20 text-right whitespace-nowrap">
          {formatTime(Math.floor(currentTime))} / {formatTime(Math.floor(duration))}
        </span>
      </div>
    </div>
  );
};

const MemoizedVoiceMessagePlayer = memo(VoiceMessagePlayer);

export default MemoizedVoiceMessagePlayer;
