export const APP_ROUTES = {
  WELCOME: '/',
  CHAT: '/chat',
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
  },
};

export const API_ROUTES = {
  CHAT: '/chat',
  CHATS: {
    GET: '/chats',
    CREATE: '/createChat',
    UPDATE: '/updateChat',
    DELETE: '/deleteChat',
  },
  MESSAGE: {
    GET: '/getChatMessages',
    CREATE: '/createMessage',
  },
  USER: {
    CREATE: '/createUser',
  },
};
