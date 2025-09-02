import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginContract, useLoginContract } from '@presentation/contracts/auth/LoginContract.tsx';
import { Alert, Button, Card, Form, Input } from 'antd';
import { FC, memo } from 'react';
import { Controller } from 'react-hook-form';

type LoginFormProps = {
  useContract?: () => LoginContract;
};

const LoginForm: FC<LoginFormProps> = ({ useContract = useLoginContract }) => {
  const { signIn, loading, error, form } = useContract();

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Card className="w-full max-w-md" title="Вход в аккаунт">
      <Form layout="vertical" onFinish={signIn} className="space-y-4">
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
        >
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<UserOutlined className="text-gray-300" />}
                placeholder="Введите имя пользователя"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Пароль"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message as string}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                prefix={<LockOutlined className="text-gray-300" />}
                placeholder="Введите пароль"
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
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const MemoizedLoginForm = memo(LoginForm);

export default MemoizedLoginForm;
