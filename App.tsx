import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import './global.css';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <StatusBar style="auto" />
      <View className="animate-pulse">
        <Text className="text-xl font-bold text-blue-500">Welcome to nilGPT!</Text>
      </View>
    </View>
  );
}
