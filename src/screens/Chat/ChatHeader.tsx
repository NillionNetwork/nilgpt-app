import { View } from 'react-native';
import { AntDesign } from '@/components/ExpoIcon';
import { Button } from '@/components/ui/button';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDrawerStatus } from '@react-navigation/drawer';

const ChatHeader: React.FC = () => {
  const drawerStatus = useDrawerStatus();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{ top }}
      className="absolute z-10 flex w-full flex-row items-center justify-between self-center bg-transparent pt-3">
      <Button
        className="h-10 w-10 items-center justify-center rounded-full"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <AntDesign
          name={drawerStatus === 'open' ? 'close' : 'menu'}
          size={16}
          className="absolute self-center color-yellow"
        />
      </Button>
      <Button className="h-10 w-10 items-center justify-center rounded-full">
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
