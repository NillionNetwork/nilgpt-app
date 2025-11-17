import { View } from 'react-native';
import { AntDesign } from '@/components/ExpoIcon';
import { Button } from '@/components/ui/button';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const ChatHeader: React.FC = () => {
  const navigation = useNavigation();

  return (
    <>
      <View className="flex w-full flex-row items-center justify-between bg-transparent">
        <Button
          className="h-10 w-10 items-center justify-center rounded-full"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <AntDesign
            name="menu"
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
    </>
  );
};

export default ChatHeader;
