import React, { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import Loading from '../components/Loading';
import { PATH_AUTH, PATH_DASHBOARD } from './path';

// Layouts

// Config

const Loadable = (Component: React.FC) => (props: any) => {
  return (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    { path: '/', element: <Navigate to={PATH_DASHBOARD.app.chats} /> },
    {
      path: PATH_DASHBOARD.root,
      element: <AppLayout />,
      children: [
        {
          path: PATH_DASHBOARD.root,
          element: <Navigate to={PATH_DASHBOARD.app.chats} />,
        },
        { path: PATH_DASHBOARD.app.chats, element: <ChatsPage /> },
        { path: PATH_DASHBOARD.app.groups, element: <GroupsPage /> },
        { path: PATH_DASHBOARD.app.calls, element: <CallsPage /> },
        { path: PATH_DASHBOARD.app.settings, element: <SettingsPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
    {
      path: PATH_AUTH.root,
      element: <AuthLayout />,
      children: [
        { path: PATH_AUTH.auth.login, element: <LoginPage /> },
        { path: PATH_AUTH.auth.register, element: <RegisterPage /> },
        { path: PATH_AUTH.auth.verify, element: <VerifyPage /> },
      ],
    },
    { path: '*', element: <NotFoundPage /> },
  ]);
}

// App Routes
const AppLayout = Loadable(lazy(() => import('../layouts/app')));
const ChatsPage = Loadable(lazy(() => import('../pages/app/Chats')));
const GroupsPage = Loadable(lazy(() => import('../pages/app/Groups')));
const CallsPage = Loadable(lazy(() => import('../pages/app/Calls')));
const SettingsPage = Loadable(lazy(() => import('../pages/app/Settings')));

// Auth Routes
const AuthLayout = Loadable(lazy(() => import('../layouts/auth')));
const LoginPage = Loadable(lazy(() => import('../pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('../pages/auth/Register')));
const VerifyPage = Loadable(lazy(() => import('../pages/auth/Verify')));

const NotFoundPage = Loadable(lazy(() => import('../pages/NotFound')));
