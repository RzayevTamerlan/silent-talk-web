import useUpload from '@business/services/upload/useUpload.ts';
import { showToasts } from '@business/shared/utils/showToasts.ts';
import { MediaType } from '@domain/enums/MediaType.ts';
import { MessageType } from '@domain/enums/MessageType.ts';
import { SendMessageDto } from '@infra/dtos/message/SendMessageDto.ts';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseVoiceRecordingProps {
  createNewMessage: (data: SendMessageDto) => void;
}

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  isUploading: boolean;
  startRecording: () => void;
  stopRecording: () => void; // Эта функция теперь только отправляет
  cancelRecording: () => void; // Новая функция для отмены
  recordingTimer: number;
}

const useVoiceRecording = ({
  createNewMessage,
}: UseVoiceRecordingProps): UseVoiceRecordingReturn => {
  const { handleUpload, isLoading: isUploading } = useUpload();

  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else {
      setTimer(0);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStopAndUpload = useCallback(async () => {
    if (audioChunksRef.current.length === 0) return;

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const audioFile = new File([audioBlob], 'voice-message.webm', {
      type: 'audio/webm',
    });
    audioChunksRef.current = [];

    try {
      const uploadedUrl = await handleUpload('voice', audioFile);
      if (uploadedUrl) {
        createNewMessage({
          type: MessageType.VOICE,
          medias: [{ type: MediaType.VOICE, url: uploadedUrl }],
        });
      } else {
        showToasts('Failed to upload voice message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error during voice message upload:', error);
    }
  }, [handleUpload, createNewMessage]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.start();

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Эта функция будет вызвана ТОЛЬКО при вызове .stop()
      mediaRecorder.onstop = handleStopAndUpload;
    } catch (err) {
      // ... обработка ошибок
      showToasts('Microphone access was denied.', 'error');
      setIsRecording(false);
      console.log('Error accessing microphone:', err);
    }
  }, [handleStopAndUpload]);

  // Эта функция останавливает запись И отправляет файл
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop(); // Это триггерит onstop -> handleStopAndUpload
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [isRecording]);

  // --- НОВАЯ ФУНКЦИЯ ---
  // Эта функция просто отменяет запись
  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      // Убираем обработчик onstop, чтобы он не сработал
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();

      // Очищаем треки микрофона
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

      // Сбрасываем состояние
      setIsRecording(false);
      audioChunksRef.current = [];
    }
  }, [isRecording]);

  return {
    isRecording,
    isUploading,
    startRecording,
    stopRecording,
    cancelRecording, // Возвращаем новую функцию
    recordingTimer: timer,
  };
};

export default useVoiceRecording;
