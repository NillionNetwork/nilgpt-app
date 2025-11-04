import { useAuthContext } from '@hooks/useAuthContext';
import * as SplashScreen from 'expo-splash-screen';

const SplashScreenController: React.FC = () => {
  const { isLoading } = useAuthContext();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
};

export default SplashScreenController;
