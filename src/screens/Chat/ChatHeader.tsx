import { useDrawerStatus } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AntDesign } from '@/components/ExpoIcon';
import { Button } from '@/components/ui/button';
import useNewChat from '@/hooks/useNewChat';

const ChatHeader: React.FC = () => {
  const drawerStatus = useDrawerStatus();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { createNewChat } = useNewChat();

  const handleDrawerToggle = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View
      style={{ top }}
      className="absolute z-10 flex w-full flex-row items-center justify-between self-center bg-transparent pt-3">
      <Button
        variant="secondary"
        className="h-10 w-10 items-center justify-center rounded-full"
        onPress={handleDrawerToggle}>
        <AntDesign
          name={drawerStatus === 'open' ? 'close' : 'menu'}
          size={16}
          className="absolute self-center color-yellow"
        />
      </Button>
      <Button
        variant="secondary"
        className="h-10 w-10 items-center justify-center rounded-full"
        onPress={createNewChat}>
        <AntDesign
          name="plus"
          size={16}
          className="absolute self-center color-yellow"
        />
      </Button>
    </View>
  );
};

export default ChatHeader;
