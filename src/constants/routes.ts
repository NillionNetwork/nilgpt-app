export const APP_ROUTES = {
  WELCOME: '/',
  CHAT: '/chat/[id]',
  PIN: '/pin',
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
    DELETE: '/deleteAccount',
  },
} as const;
