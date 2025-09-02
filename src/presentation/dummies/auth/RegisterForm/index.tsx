import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import {
  RegisterContract,
  useRegisterContract,
} from '@presentation/contracts/auth/RegisterContract.tsx';
import { Alert, Button, Card, Form, Input } from 'antd';
import { FC, memo } from 'react';
import { Controller } from 'react-hook-form';

type RegisterFormProps = {
  useContract?: () => RegisterContract;
};

const RegisterForm: FC<RegisterFormProps> = ({ useContract = useRegisterContract }) => {
  const { signUp, loading, error, form } = useContract();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Card className="w-full max-w-md" title="Регистрация аккаунта">
      <Form layout="vertical" onFinish={signUp} className="space-y-4">
        {error && error.length > 0 && (
          <Alert
            message="Ошибка"
            description={error}
            type="error"
            showIcon
            closable
            className="mb-4"
          />
        )}

        <Form.Item
          label="Имя пользователя"
          validateStatus={errors.username ? 'error' : ''}
          help={errors.username?.message as string}
          required
        >
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<UserOutlined className="text-gray-300" />}
                placeholder="Придумайте имя пользователя"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Пароль"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message as string}
          required
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                prefix={<LockOutlined className="text-gray-300" />}
                placeholder="Придумайте пароль"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Email (необязательно)"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message as string}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<MailOutlined className="text-gray-300" />}
                placeholder="Введите email (необязательно)"
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
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const MemoizedRegisterForm = memo(RegisterForm);

export default MemoizedRegisterForm;
