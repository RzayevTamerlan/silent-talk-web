import LoginForm from '@presentation/dummies/auth/LoginForm';
import LoginWidget from '@presentation/widgets/auth/LoginWidget.tsx';
import { memo } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md">
            {/* Заголовок страницы */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Добро пожаловать</h1>
              <p className="text-gray-300">Войдите в свой аккаунт чтобы продолжить</p>
            </div>

            {/* Виджет с формой */}
            <LoginWidget>
              <LoginForm />
            </LoginWidget>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Нет аккаунта?{' '}
                <Link
                  to="/register"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const MemoizedLoginPage = memo(LoginPage);

export default MemoizedLoginPage;
