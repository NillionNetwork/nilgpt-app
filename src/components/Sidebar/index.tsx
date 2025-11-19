import { type DrawerContentComponentProps } from '@react-navigation/drawer';
import { Link, useGlobalSearchParams } from 'expo-router';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import { Button } from '@ui/button';
import { APP_ROUTES } from '@/constants/routes';
import API from '@/services/API';
import { cn } from '@/utils/cn';
import { supabase } from '@services/Supabase';
import { Text } from '@ui/text';
import { Feather } from '@/components/ExpoIcon';

const Sidebar: React.FC<DrawerContentComponentProps> = () => {
  const { id: currentChatId } = useGlobalSearchParams<{ id: string }>();
  const { data: chats } = API.useChats();

  const _chats = chats?.filter((chat) => chat.title !== 'null');

  return (
    <SafeAreaView className="flex flex-1 bg-black p-3">
      <Text variant="h1" className="text-white">
        nilGPT
      </Text>
      <FlatList
        data={_chats}
        keyExtractor={(item) => item._id}
        contentContainerClassName="flex gap-2 w-full items-stretch py-3"
        renderItem={({ item }) => {
          const isActive = item._id === currentChatId;
          return (
            <Link
              href={`${APP_ROUTES.CHAT}/${item._id}`}
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
      <Button
        onPress={() => supabase.auth.signOut()}
        className="mx-auto mt-3 w-fit rounded-full">
        <Text className="text-yellow">Logout</Text>
        <Feather name="log-out" size={16} className="text-yellow" />
      </Button>
      <Text className="mt-2 text-center text-xs text-yellow">
        v{Constants.expoConfig?.version}
      </Text>
    </SafeAreaView>
  );
};

export default Sidebar;
