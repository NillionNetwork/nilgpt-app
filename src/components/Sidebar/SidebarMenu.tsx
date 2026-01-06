import Constants from 'expo-constants';
import { View } from 'react-native';

import { Feather } from '@components/ExpoIcon';
import { useAuthContext } from '@hooks/useAuthContext';
import { supabase } from '@services/Supabase';
import { Button } from '@ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Text } from '@ui/text';

const SidebarMenu: React.FC = () => {
  const { session } = useAuthContext();
  const userEmail = session?.user?.email;
  const userName = session?.user?.user_metadata?.name;

  return (
    <View className="mt-3 flex w-full flex-row items-center gap-3 pl-2">
      <DropdownMenu className="border-red-800">
        <DropdownMenuTrigger asChild>
          <Button className="relative h-9 w-9 rounded-full bg-yellow">
            <Text className="absolute text-base text-black">
              {(userName || userEmail)?.charAt(0).toUpperCase()}
            </Text>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="top"
          sideOffset={10}
          className="border-0 bg-neutral-900">
          <DropdownMenuLabel className="mt-1">
            <View className="flex flex-col">
              <Text className="text-sm text-gray-500">Signed in as</Text>
              <Text numberOfLines={1} className="text-sm text-white">
                {userEmail}
              </Text>
            </View>
          </DropdownMenuLabel>
          <DropdownMenuItem variant="destructive">
            <Feather name="trash" size={16} className="text-red-500" />
            <Text
              className="text-red-500 active:text-red-500"
              suppressHighlighting
              pointerEvents="none">
              Delete Account
            </Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-neutral-800" />
          <DropdownMenuItem
            variant="destructive"
            onPress={() => supabase.auth.signOut()}>
            <Feather name="log-out" size={16} className="text-red-500" />
            <Text
              className="text-red-500 active:text-red-500"
              suppressHighlighting
              pointerEvents="none">
              Logout
            </Text>
          </DropdownMenuItem>

          <Text className="my-1 text-center text-xs text-gray-500">
            v{Constants.expoConfig?.version}
          </Text>
        </DropdownMenuContent>
      </DropdownMenu>

      <Text className="max-w-[80%] text-sm text-yellow" numberOfLines={1}>
        {userName || userEmail}
      </Text>
    </View>
  );
};

export default SidebarMenu;
