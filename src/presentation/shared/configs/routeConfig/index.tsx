import MainLayout from '@presentation/layouts/MainLayout';
import AuthorizedOnlyRoute from '@presentation/pipes/AuthorizedOnlyRoute.tsx';
import UnAuthorizedOnlyRoute from '@presentation/pipes/UnAuthorizedOnlyRoute.tsx';
import Fallback from '@presentation/shared/ui/Fallback';
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('@presentation/pages/Home'));
const LoginPage = lazy(() => import('@presentation/pages/Login'));
const RegisterPage = lazy(() => import('@presentation/pages/Register'));
const ChatPage = lazy(() => import('@presentation/pages/Chat'));

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthorizedOnlyRoute>
        <MainLayout />
      </AuthorizedOnlyRoute>
    ),
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<Fallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/chats/:chatId',
        element: (
          <Suspense fallback={<Fallback />}>
            <ChatPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <UnAuthorizedOnlyRoute>
        <Suspense fallback={<Fallback />}>
          <LoginPage />
        </Suspense>
      </UnAuthorizedOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <UnAuthorizedOnlyRoute>
        <Suspense fallback={<Fallback />}>
          <RegisterPage />
        </Suspense>
      </UnAuthorizedOnlyRoute>
    ),
  },
  {
    path: '*',
    element: <Suspense fallback={<Fallback />}>Not Found</Suspense>,
  },
];
