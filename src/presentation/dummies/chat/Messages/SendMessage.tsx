import {
  AudioOutlined,
  CheckOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { UploadType } from '@business/services/upload/useUpload.ts';
import { MediaType } from '@domain/enums/MediaType.ts';
import { MessageType } from '@domain/enums/MessageType.ts';
import { ChatContract, useChatContract } from '@presentation/contracts/chat/ChatContract.tsx';
import { formatTime } from '@presentation/shared/utils/formatTime.ts';
import { Alert, Button, Image, Input } from 'antd';
import { ChangeEvent, memo, useRef } from 'react';
import { Controller } from 'react-hook-form';

const { TextArea } = Input;

const getUploadTypeFromFile = (file: File): UploadType => {
  const type = file.type;
  if (type.startsWith('image/')) return 'photo';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  return 'document';
};

const getMediaTypeFromUploadType = (type: UploadType): MediaType => {
  if (type === 'photo') return MediaType.IMAGE;
  if (type === 'video') return MediaType.VIDEO;
  if (type === 'audio') return MediaType.AUDIO;
  return MediaType.DOCUMENT;
};

const SendMessage = () => {
  const contract = useChatContract();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (contract.mode !== 'default') return;

    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);

    // 1. Группируем файлы по типу
    const fileGroups = filesArray.reduce(
      (acc, file) => {
        const uploadType = getUploadTypeFromFile(file);
        if (!acc[uploadType]) {
          acc[uploadType] = [];
        }
        acc[uploadType].push(file);
        return acc;
      },
      {} as Record<UploadType, File[]>,
    );

    // 2. Загружаем каждую группу и собираем результаты
    const allUploadedMedias: { url: string; type: MediaType }[] = [];

    for (const type in fileGroups) {
      const uploadType = type as UploadType;
      const filesToUpload = fileGroups[uploadType];

      const urlsString = await contract.handleMultipleUpload(uploadType, filesToUpload);
      if (urlsString) {
        const urls = urlsString.split(',');
        const mediaType = getMediaTypeFromUploadType(uploadType);
        urls.forEach(url => {
          allUploadedMedias.push({ url, type: mediaType });
        });
      }
    }

    // 3. Обновляем состояние формы
    if (allUploadedMedias.length > 0) {
      const currentMedias = contract.chatForm.getValues('medias') || [];
      contract.chatForm.setValue('medias', [...currentMedias, ...allUploadedMedias]);
    }

    // Сбрасываем значение инпута, чтобы можно было выбрать те же файлы снова
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderInputArea = (componentContract: ChatContract) => {
    switch (componentContract.mode) {
      case 'voice':
        return (
          <div className="flex items-center justify-between w-full">
            <Button
              type="primary"
              danger
              size="large"
              htmlType="button"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={componentContract.cancelRecording}
            />
            <div className="text-gray-300 font-mono mx-4">
              {formatTime(componentContract.recordingTimer)}
            </div>
            <Button
              type="primary"
              size="large"
              shape="circle"
              icon={<SendOutlined />}
              onClick={componentContract.stopRecording}
              loading={componentContract.mutationLoading}
            />
          </div>
        );

      case 'edit':
        return (
          <>
            <Controller
              name="text"
              control={componentContract.chatForm.control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  size="large"
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  style={{ resize: 'none' }}
                  placeholder="Редактировать сообщение..."
                  className="flex-grow mr-4"
                  disabled={componentContract.mutationLoading}
                  autoFocus
                />
              )}
            />
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              htmlType="submit"
              loading={componentContract.mutationLoading}
            />
          </>
        );

      case 'default': {
        // TypeScript знает, что здесь componentContract имеет тип ChatDefaultMode
        const { chatForm } = componentContract;
        const textValue = chatForm.watch('text');
        const mediasValue = chatForm.watch('medias');

        const hasText = textValue && textValue.trim().length > 0;
        const hasMedias = mediasValue && mediasValue.length > 0;

        // 1. Определяем, нужно ли показывать кнопку отправки
        const showSendButton = hasText || hasMedias;

        const buttonIcon = showSendButton ? <SendOutlined /> : <AudioOutlined />;

        return (
          <div className="flex flex-col w-full">
            {/* Блок превью медиа (без изменений) */}
            {mediasValue && mediasValue.length > 0 && (
              <div className="flex space-x-2 mb-2 overflow-x-auto">
                {mediasValue.map((media, index) => (
                  <div key={index} className="relative">
                    {media.type === MediaType.IMAGE ? (
                      <Image
                        src={`${import.meta.env.VITE_BACKEND_URL}${media.url}`}
                        alt={`attachment-${index}`}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 flex items-center justify-center bg-gray-700 rounded">
                        <span className="text-sm text-gray-300">
                          {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
                        </span>
                      </div>
                    )}
                    <Button
                      type="text"
                      shape="circle"
                      icon={<DeleteOutlined />}
                      size="small"
                      className="absolute -top-2 -right-2 bg-red-600 text-white"
                      onClick={() => {
                        const newMedias = mediasValue.filter((_, i) => i !== index);
                        chatForm.setValue('medias', newMedias);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center w-full justify-between">
              {/* Кнопка "скрепки" и Input (без изменений) */}
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={onFileChange}
                style={{ display: 'none' }}
              />
              <Button
                size="large"
                icon={<PaperClipOutlined />}
                onClick={handleAttachClick}
                className="mr-4"
                disabled={componentContract.mutationLoading}
              />
              <Controller
                name="text"
                control={chatForm.control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    style={{ resize: 'none' }}
                    size="large"
                    placeholder="Напишите сообщение..."
                    className="flex-grow mr-4"
                    disabled={componentContract.mutationLoading}
                  />
                )}
              />

              <Button
                type="primary"
                size="large"
                icon={buttonIcon}
                loading={componentContract.mutationLoading}
                // Динамически меняем поведение кнопки
                htmlType={showSendButton ? 'submit' : 'button'}
                onClick={!showSendButton ? componentContract.startRecording : undefined}
              />
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      {contract.replyToMessage && (
        <Alert
          message={`Ответ на сообщение: ${contract.replyToMessage.type === MessageType.TEXT ? `${contract.replyToMessage.text?.substring(0, 50) || 'Медиафайл'}...` : 'Голосове сообщение'}`}
          type="info"
          closable
          onClose={() => contract.setReplyToMessage(null)}
          className="mb-2"
        />
      )}
      {contract.mode === 'edit' && contract.editMessage && (
        <Alert
          message={`Редактирование сообщения...`}
          type="warning"
          closable
          onClose={contract.cancelEdit}
          className="mb-2"
        />
      )}

      <form
        onSubmit={
          contract.mode !== 'voice'
            ? e => {
                e.preventDefault();
                // @ts-expect-error (необходимо для корректной работы формы)
                contract.chatForm.setValue('type', MessageType.TEXT);
                contract.handleSubmit(e);
              }
            : e => e.preventDefault()
        }
        className="flex items-center"
      >
        {renderInputArea(contract)}
      </form>
    </div>
  );
};

const MemoizedSendMessage = memo(SendMessage);

export default MemoizedSendMessage;
