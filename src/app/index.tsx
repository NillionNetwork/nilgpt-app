import React from 'react';
import { View } from 'react-native';
import { Button } from '@ui/button';
import { router } from 'expo-router';
import { Text } from '@ui/text';

const Home = () => {
  const goToAuth = () => {
    router.push('/auth');
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Button onPress={goToAuth} className="w-full max-w-sm">
        <Text>Go to Auth Page</Text>
      </Button>
    </View>
  );
};

export default Home;
