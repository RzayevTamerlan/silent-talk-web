import { KeyOutlined } from '@ant-design/icons';
import {
  EnterChatContract,
  useEnterChatContract,
} from '@presentation/contracts/chat/EnterChatContract.tsx';
import { Alert, Button, Card, Form, Input } from 'antd';
import { FC, memo } from 'react';
import { Controller } from 'react-hook-form';

type EnterChatFormProps = {
  useContract?: () => EnterChatContract;
};

const EnterChatForm: FC<EnterChatFormProps> = ({ useContract = useEnterChatContract }) => {
  const { form, error, enterChat, loading } = useContract();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Card className="w-full max-w-md" title="Вход в чат по ключу доступа">
      <Form layout="vertical" onFinish={enterChat} className="space-y-4">
        {error && error.length > 0 && (
          <Alert
            message="Ошибка"
            description={error}
            type="error"
            showIcon
            closable
            className="mb-4 bg-red-900/20 border-red-800"
          />
        )}

        <Form.Item
          label={<span className="text-gray-300">Ключ доступа</span>}
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
                placeholder="Введите ключ доступа"
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
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
            className="w-full bg-blue-600 hover:bg-blue-700 border-none"
          >
            {loading ? 'Вход...' : 'Войти в чат'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const MemoizedEnterChatForm = memo(EnterChatForm);

export default MemoizedEnterChatForm;
