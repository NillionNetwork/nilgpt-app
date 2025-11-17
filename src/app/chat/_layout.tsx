import Sidebar from '@/components/Sidebar';
import Drawer from 'expo-router/drawer';

const ChatLayout: React.FC = () => {
  return (
    <Drawer
      backBehavior="none"
      initialRouteName="[id]"
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{ headerShown: false, drawerHideStatusBarOnOpen: true }}
    />
  );
};

export default ChatLayout;
