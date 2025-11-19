import { AntDesign } from '@expo/vector-icons';
import { type DrawerContentComponentProps } from '@react-navigation/drawer';
import { Button } from '@ui/button';
import { Link, useGlobalSearchParams } from 'expo-router';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_ROUTES } from '@/constants/routes';
import API from '@/services/API';
import { cn } from '@/utils/cn';
import { supabase } from '@services/Supabase';
import { Text } from '@ui/text';

const Sidebar: React.FC<DrawerContentComponentProps> = () => {
  const { id: currentChatId } = useGlobalSearchParams<{ id: string }>();
  const { data: chats } = API.useChats();

  const _chats = chats?.filter((chat) => chat.title !== 'null');

  return (
    <SafeAreaView className="flex flex-1 p-3">
      <Text variant="h1">nilGPT</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
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
                'flex w-full rounded-md px-3 py-2 active:bg-yellow/20',
                isActive ? 'bg-yellow/50' : 'bg-yellow/5',
              )}>
              <Text>{item.title}</Text>
            </Link>
          );
        }}
      />
      <Button
        onPress={() => supabase.auth.signOut()}
        className="mx-auto mt-3 w-fit rounded-full">
        <Text className="text-yellow">Logout</Text>
        <AntDesign name="logout" size={16} className="text-yellow" />
      </Button>
    </SafeAreaView>
  );
};

export default Sidebar;
