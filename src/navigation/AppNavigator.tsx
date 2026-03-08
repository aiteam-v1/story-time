import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import HeroInputScreen from '../screens/HeroInputScreen';
import StoryReaderScreen from '../screens/StoryReaderScreen';
import StoryEndScreen from '../screens/StoryEndScreen';

export type RootStackParamList = {
  Home: undefined;
  HeroInput: { storyId: string };
  StoryReader: { storyId: string; heroName: string };
  StoryEnd: { storyId: string; heroName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="HeroInput" component={HeroInputScreen} />
      <Stack.Screen name="StoryReader" component={StoryReaderScreen} />
      <Stack.Screen name="StoryEnd" component={StoryEndScreen} />
    </Stack.Navigator>
  );
}
