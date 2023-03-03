import React, { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import Loading from '../components/Loading';
import { PATH_DASHBOARD } from './path';

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
    {
      path: PATH_DASHBOARD.root,
      element: <AppLayout />,
      children: [
        { path: PATH_DASHBOARD.app.chat, element: <ChatPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);
}

const AppLayout = Loadable(lazy(() => import('../layouts/app')));
const ChatPage = Loadable(lazy(() => import('../pages/app/Chat')));
const NotFoundPage = Loadable(lazy(() => import('../pages/NotFound')));
