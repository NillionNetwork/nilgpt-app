import Sidebar from '@/components/Sidebar';
import Drawer from 'expo-router/drawer';
import { v4 as uuidv4 } from 'uuid';

const ChatLayout: React.FC = () => {
  return (
    <Drawer
      backBehavior="none"
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="[id]"
        initialParams={{ id: uuidv4(), newChat: 'true' }}
      />
    </Drawer>
  );
};

export default ChatLayout;
