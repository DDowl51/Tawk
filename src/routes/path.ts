const path = (...paths: string[]) =>
  `/${paths
    .join('/')
    .split('/')
    .filter(path => path.length)
    .join('/')}`;

const ROOTS_DASHBOARD = path('/', 'app');
const ROOTS_AUTH = path('/', 'auth');

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  app: {
    chat: path(ROOTS_DASHBOARD, 'chat'),
    settings: path(ROOTS_DASHBOARD, 'settings'),
    group: path(ROOTS_DASHBOARD, 'group'),
    call: path(ROOTS_DASHBOARD, 'call'),
    profile: path(ROOTS_DASHBOARD, 'profile'),
  },
};

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  auth: {
    login: path(ROOTS_AUTH, 'login'),
    register: path(ROOTS_AUTH, 'register'),
    resetPassword: path(ROOTS_AUTH, 'reset-password'),
    newPassword: path(ROOTS_AUTH, 'new-password'),
    verify: path(ROOTS_AUTH, 'verify'),
  },
};
