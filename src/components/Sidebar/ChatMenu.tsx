import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ui/dialog';
import { Input } from '@ui/input';
import { Text } from '@ui/text';
import { Feather, FontAwesome6 } from '../ExpoIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { IChatMenuProps } from './types';
import API from '@/services/API';

const ChatMenu: React.FC<IChatMenuProps> = ({ chatId, title }) => {
  const [isChatTitleDialogOpen, setIsChatTitleDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const { refetch: refetchChats, isPending: isRefetchingChats } =
    API.useChats();
  const { mutateAsync: updateChatMutation, isPending: isUpdatingChatTitle } =
    API.useUpdateChat();
  const { mutateAsync: deleteChatMutation, isPending: isDeletingChat } =
    API.useDeleteChat();

  const handleUpdateChatTitle = async () => {
    const { success } = await updateChatMutation({
      _id: chatId,
      title: newTitle,
    });

    if (success) {
      setIsChatTitleDialogOpen(false);
      refetchChats();
    }
  };

  const handleDeleteChat = async () => {
    const { success } = await deleteChatMutation({
      chatId,
    });

    if (success) {
      refetchChats();
    }
  };

  return (
    <View>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Pressable
            className="flex-shrink-0 px-4 py-1 active:opacity-70 disabled:opacity-30"
            disabled={
              isDeletingChat || isUpdatingChatTitle || isRefetchingChats
            }>
            <FontAwesome6
              name="ellipsis-vertical"
              size={14}
              className="text-black"
              suppressHighlighting
            />
          </Pressable>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          alignOffset={-5}
          sideOffset={-24}
          className="border-neutral-800 bg-neutral-900">
          <DropdownMenuItem onPress={() => setIsChatTitleDialogOpen(true)}>
            <Feather name="edit" size={14} className="text-primary" />
            <Text suppressHighlighting pointerEvents="none">
              Rename
            </Text>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onPress={handleDeleteChat}>
            <Feather name="trash" size={14} className="text-red-400" />
            <Text
              className="text-red-400"
              suppressHighlighting
              pointerEvents="none">
              Delete
            </Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={isChatTitleDialogOpen}
        onOpenChange={(open) => {
          setNewTitle(title);
          setIsChatTitleDialogOpen(open);
        }}>
        <DialogContent
          className="w-[80vw]"
          overlayClassName="justify-start pt-[70%]">
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <Input
            value={newTitle}
            className="w-full"
            autoFocus
            returnKeyType="done"
            onChangeText={setNewTitle}
            onSubmitEditing={() => {}}
            maxLength={50}
          />
          {newTitle.length > 40 && (
            <Text className="-mb-2 -mt-3.5 ml-auto pr-0.5 text-xs text-red-400">
              {newTitle.length} / 50
            </Text>
          )}
          <Button
            isLoading={isUpdatingChatTitle}
            disabled={isUpdatingChatTitle || newTitle.length === 0}
            onPress={handleUpdateChatTitle}>
            <Text>Save</Text>
          </Button>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default ChatMenu;
