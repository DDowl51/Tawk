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
    chats: path(ROOTS_DASHBOARD, 'chats'),
    settings: {
      root: path(ROOTS_DASHBOARD, 'settings'),
      notification: path(ROOTS_DASHBOARD, 'settings/notification'),
      privacy: path(ROOTS_DASHBOARD, 'settings/privacy'),
      security: path(ROOTS_DASHBOARD, 'settings/security'),
      theme: path(ROOTS_DASHBOARD, 'settings/theme'),
      chatWallpaper: path(ROOTS_DASHBOARD, 'settings/chatWallpaper'),
      keyboardShortcuts: path(ROOTS_DASHBOARD, 'settings/keyboardShortcuts'),
      help: path(ROOTS_DASHBOARD, 'settings/help'),
    },
    groups: path(ROOTS_DASHBOARD, 'groups'),
    calls: path(ROOTS_DASHBOARD, 'calls'),
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
