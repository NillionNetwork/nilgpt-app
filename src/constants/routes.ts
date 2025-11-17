export const APP_ROUTES = {
  WELCOME: '/',
  CHAT: '/chat',
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
  },
} as const;

export const API_ROUTES = {
  CHAT: '/chat',
  CHATS: {
    GET: '/getChats',
    CREATE: '/createChat',
    UPDATE: '/updateChat',
    DELETE: '/deleteChat',
  },
  MESSAGES: {
    GET: '/getChatMessages',
    CREATE: '/createMessage',
  },
  USER: {
    CREATE: '/createUser',
  },
} as const;
