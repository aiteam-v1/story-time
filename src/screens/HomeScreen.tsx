import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ListRenderItemInfo,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { STORIES } from '../data/stories';
import { Story } from '../types';
import StoryCard from '../components/StoryCard';

type HomeScreenNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNav>();

  const handleStoryPress = (storyId: string) => {
    navigation.navigate('HeroInput', { storyId });
  };

  const renderItem = ({ item }: ListRenderItemInfo<Story>) => (
    <StoryCard story={item} onPress={() => handleStoryPress(item.id)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>📚 Story Time</Text>
        <Text style={styles.subheading}>Pick a story to read!</Text>
      </View>
      <FlatList
        data={STORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No stories yet — check back soon!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF6B35',
  },
  subheading: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 60,
  },
});
