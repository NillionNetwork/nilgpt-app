import Constants from 'expo-constants';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import API from '@/services/API';
import { Feather } from '@components/ExpoIcon';
import { useAuthContext } from '@hooks/useAuthContext';
import { supabase } from '@services/Supabase';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/alert-dialog';
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

  const [isAccountDeleteDialogOpen, setIsAccountDeleteDialogOpen] =
    useState(false);

  const {
    mutateAsync: deleteAccountMutation,
    isPending: isDeletingAccount,
    isError: isDeleteAccountError,
  } = API.useDeleteAccount();

  const handleDeleteAccount = async () => {
    const { success } = await deleteAccountMutation();
    if (success) {
      setIsAccountDeleteDialogOpen(false);
      supabase.auth.signOut();
    }
  };

  return (
    <View className="mt-3 flex w-full flex-row items-center gap-3 pl-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative h-9 w-9 rounded-full bg-yellow active:bg-yellow/50">
            <Text className="absolute text-base text-black">
              {(userName || userEmail)?.charAt(0).toUpperCase()}
            </Text>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="top"
          sideOffset={10}
          className="border-neutral-800 bg-neutral-900">
          <DropdownMenuLabel className="mt-1">
            <View className="flex flex-col">
              <Text className="text-sm text-gray-400">Signed in as</Text>
              <Text numberOfLines={1} className="text-sm text-white">
                {userName || userEmail}
              </Text>
            </View>
          </DropdownMenuLabel>
          <DropdownMenuItem
            variant="destructive"
            onPress={() => setIsAccountDeleteDialogOpen(true)}>
            <Feather name="trash" size={16} className="text-red-400" />
            <Text
              className="text-red-400"
              suppressHighlighting
              pointerEvents="none">
              Delete Account
            </Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-neutral-800" />
          <DropdownMenuItem
            variant="destructive"
            onPress={() => supabase.auth.signOut()}>
            <Feather name="log-out" size={16} className="text-red-400" />
            <Text
              className="text-red-400"
              suppressHighlighting
              pointerEvents="none">
              Logout
            </Text>
          </DropdownMenuItem>
          <Text className="my-1 text-center text-xs text-gray-400">
            v{Constants.expoConfig?.version}
          </Text>
        </DropdownMenuContent>
      </DropdownMenu>
      <Text className="max-w-[80%] text-sm text-yellow" numberOfLines={1}>
        {userName || userEmail}
      </Text>
      <AlertDialog
        open={isAccountDeleteDialogOpen}
        onOpenChange={setIsAccountDeleteDialogOpen}>
        <AlertDialogContent className="border-neutral-800 bg-neutral-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your
              account and remove all your chats and messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {isDeletingAccount ? (
              <ActivityIndicator size="small" className="my-8" />
            ) : (
              <>
                <AlertDialogCancel
                  className="border-neutral-700 bg-neutral-800 active:bg-neutral-800/80"
                  onPress={() => setIsAccountDeleteDialogOpen(false)}>
                  <Text
                    className="bg-transparent !text-white"
                    suppressHighlighting
                    pointerEvents="none">
                    Cancel
                  </Text>
                </AlertDialogCancel>
                <Button
                  className="bg-red-600 active:bg-red-600/80"
                  onPress={handleDeleteAccount}>
                  <Text
                    className="bg-transparent !text-white"
                    suppressHighlighting
                    pointerEvents="none">
                    Continue
                  </Text>
                </Button>
              </>
            )}
          </AlertDialogFooter>
          {isDeleteAccountError && (
            <Text className="text-center text-xs text-red-400">
              Error deleting account. Please try again.
            </Text>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
};

export default SidebarMenu;
