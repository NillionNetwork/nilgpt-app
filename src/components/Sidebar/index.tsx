import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Link } from 'expo-router';
import { FlatList } from 'react-native';

import { APP_ROUTES } from '@/constants/routes';
import API from '@/services/API';
import { cn } from '@/utils/cn';
import { Text } from '@ui/text';

const Sidebar: React.FC<DrawerContentComponentProps> = ({
  state,
  descriptors,
}) => {
  const { data: chats } = API.useChats();
  const _chats = chats?.filter((chat) => chat.title !== 'null');

  return (
    <FlatList
      className="flex w-full flex-1 self-stretch"
      contentContainerClassName="w-full"
      data={_chats}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        return (
          <Link
            href={`${APP_ROUTES.CHAT}/${item._id}`}
            numberOfLines={1}
            className={cn('flex w-full flex-grow self-stretch')}>
            <Text ellipsizeMode="tail" className="w-full">
              {item.title}
            </Text>
          </Link>
        );
      }}
    />
  );
};

export default Sidebar;
