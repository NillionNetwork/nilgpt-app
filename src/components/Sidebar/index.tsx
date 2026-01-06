import { type DrawerContentComponentProps } from '@react-navigation/drawer';
import { Link, useGlobalSearchParams } from 'expo-router';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExpoImage } from '@/components/Image';
import { APP_ROUTES } from '@/constants/routes';
import API from '@/services/API';
import { cn } from '@/utils/cn';
import { Text } from '@ui/text';
import SidebarMenu from './SidebarMenu';

const Sidebar: React.FC<DrawerContentComponentProps> = () => {
  const { id: currentChatId } = useGlobalSearchParams<{ id: string }>();
  const { data: chats } = API.useChats();

  const validChats = chats?.filter((chat) => chat.title !== 'null');

  return (
    <SafeAreaView className="flex flex-1 bg-black p-3 pb-0">
      <View className="flex flex-row items-center justify-start gap-3 pb-2 pl-2">
        <ExpoImage
          source={require('@assets/logo-dark.svg')}
          className="aspect-square h-8 w-auto"
          contentFit="contain"
        />
        <Text className="text-2xl font-bold text-white">nilGPT</Text>
      </View>
      <FlatList
        data={validChats}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex gap-1 w-full items-stretch py-3"
        renderItem={({ item }) => {
          const isActive = item._id === currentChatId;
          return (
            <Link
              href={{
                pathname: APP_ROUTES.CHAT,
                params: { id: item._id, newChat: 'false' },
              }}
              numberOfLines={1}
              suppressHighlighting
              className={cn(
                'flex w-full rounded-md px-3 py-2 active:opacity-75',
                isActive ? 'bg-yellow' : 'bg-transparent',
              )}>
              <Text className={cn(isActive ? 'text-black' : 'text-white')}>
                {item.title}
              </Text>
            </Link>
          );
        }}
      />
      <SidebarMenu />
    </SafeAreaView>
  );
};

export default Sidebar;
