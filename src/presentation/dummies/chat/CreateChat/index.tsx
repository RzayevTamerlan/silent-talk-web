import { CommentOutlined, KeyOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import {
  CreateChatContract,
  useCreateChatContract,
} from '@presentation/contracts/chat/CreateChatContract.tsx';
import { Alert, Button, Card, Form, Input, InputNumber } from 'antd';
import { FC, memo } from 'react';
import { Controller } from 'react-hook-form';

type CreateChatFormProps = {
  useContract?: () => CreateChatContract;
};

const CreateChatForm: FC<CreateChatFormProps> = ({ useContract = useCreateChatContract }) => {
  const { form, createChat, error, loading } = useContract();

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Card className="w-full max-w-md" title="Создание нового чата">
      <Form layout="vertical" onFinish={createChat} className="space-y-4">
        {error && error.length > 0 && (
          <Alert
            message="Ошибка создания чата"
            description={error}
            type="error"
            showIcon
            closable
            className="mb-4"
          />
        )}

        <Form.Item
          label="Название чата"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message as string}
          required
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<CommentOutlined className="text-gray-400" />}
                placeholder="Введите название чата"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Описание"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message as string}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                size="large"
                autoSize={{ minRows: 2, maxRows: 6 }}
                placeholder="Добавьте описание (необязательно)"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Ключ доступа"
          required={true}
          validateStatus={errors.accessKey ? 'error' : ''}
          help={errors.accessKey?.message as string}
        >
          <Controller
            name="accessKey"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                prefix={<KeyOutlined className="text-gray-400" />}
                placeholder="Придумайте ключ для входа"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Макс. количество участников"
          validateStatus={errors.maxUsers ? 'error' : ''}
          help={errors.maxUsers?.message as string}
          required
        >
          <Controller
            name="maxUsers"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={2}
                max={100}
                size="large"
                className="w-full"
                prefix={<UsergroupAddOutlined className="text-gray-400 mr-2" />}
                placeholder="От 2 до 100"
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="w-full"
          >
            {loading ? 'Создание...' : 'Создать чат'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const MemoizedCreateChatForm = memo(CreateChatForm);

export default MemoizedCreateChatForm;
