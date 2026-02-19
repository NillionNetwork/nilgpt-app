import { APP_ROUTES } from '@/constants/routes';
import { useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';

const useNewChat = () => {
  const router = useRouter();

  const createNewChat = () => {
    router.push({
      pathname: APP_ROUTES.CHAT,
      params: {
        id: uuidv4(),
        newChat: 'true',
      },
    });
  };

  return { createNewChat };
};

export default useNewChat;
