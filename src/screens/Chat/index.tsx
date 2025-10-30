import { useAuthContext } from '@/hooks/useAuthContext';
import { Pressable, View } from 'react-native';
import { Text } from '@ui/text';
import ChatInput from '@components/ChatInput';
import { supabase } from '@services/Supabase';

const ChatScreen: React.FC = () => {
  const { session } = useAuthContext();

  return (
    <View className="flex h-svh flex-1 p-3">
      <Text className="text-center text-gray-500">
        Logged in as: {session?.user?.email}
      </Text>
      <Pressable onPress={() => supabase.auth.signOut()}>
        <Text className="text-center text-gray-500">Logout</Text>
      </Pressable>
      <View className="mt-auto flex flex-1 items-center justify-center">
        <ChatInput onSendMessage={() => {}} isLoading={false} />
      </View>
    </View>
  );
};

export default ChatScreen;
