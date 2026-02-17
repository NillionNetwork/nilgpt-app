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
import ChatMenu from './ChatMenu';

const Sidebar: React.FC<DrawerContentComponentProps> = () => {
  const { id: currentChatId } = useGlobalSearchParams<{ id: string }>();
  const { data: chats } = API.useChats();

  const validChats = chats?.filter((chat) => chat.title !== 'null');

  return (
    <SafeAreaView className="flex flex-1 bg-background p-3 pb-0">
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
              suppressHighlighting
              className={cn(
                'w-full rounded-md py-2 pl-3 active:opacity-75',
                isActive ? 'bg-yellow' : 'bg-transparent pr-3',
              )}>
              <View className="w-full flex-1 flex-row items-center justify-between">
                <Text
                  numberOfLines={1}
                  className={cn(
                    'flex-1',
                    isActive ? 'text-black' : 'text-white',
                  )}>
                  {item.title
                    ? item.title.charAt(0).toUpperCase() + item.title.slice(1)
                    : 'Untitled'}
                </Text>
                {isActive && <ChatMenu chatId={item._id} title={item.title} />}
              </View>
            </Link>
          );
        }}
      />
      <SidebarMenu />
    </SafeAreaView>
  );
};

export default Sidebar;
