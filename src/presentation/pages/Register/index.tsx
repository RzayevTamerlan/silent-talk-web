import RegisterForm from '@presentation/dummies/auth/RegisterForm';
import RegisterWidget from '@presentation/widgets/auth/RegisterWidget.tsx';
import { memo } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md">
            {/* Заголовок страницы */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Создание аккаунта</h1>
              <p className="text-gray-300">
                Зарегистрируйтесь, чтобы получить доступ ко всем возможностям
              </p>
            </div>

            {/* Виджет с формой */}
            <RegisterWidget redirectUrl="/login">
              <RegisterForm />
            </RegisterWidget>

            {/* Дополнительная информация или ссылки */}
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Уже есть аккаунт?{' '}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Войти
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const MemoizedRegisterPage = memo(RegisterPage);

export default MemoizedRegisterPage;
