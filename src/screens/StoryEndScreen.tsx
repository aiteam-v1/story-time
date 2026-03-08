import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { STORIES } from '../data/stories';

type StoryEndNav = NativeStackNavigationProp<RootStackParamList, 'StoryEnd'>;
type StoryEndRoute = RouteProp<RootStackParamList, 'StoryEnd'>;

export default function StoryEndScreen() {
  const navigation = useNavigation<StoryEndNav>();
  const { params } = useRoute<StoryEndRoute>();
  const { storyId, heroName } = params;

  const story = STORIES.find((s) => s.id === storyId);

  const handleReadAgain = () => {
    navigation.replace('StoryReader', { storyId, heroName });
  };

  const handleBackToStories = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {story && (
          <Image
            source={story.coverImage}
            style={styles.illustration}
            resizeMode="cover"
          />
        )}

        <Text style={styles.celebration}>🎉</Text>
        <Text style={styles.heading}>The End!</Text>
        <Text style={styles.subtitle}>
          Great reading, {heroName}!
        </Text>

        <TouchableOpacity
          style={styles.readAgainButton}
          onPress={handleReadAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.readAgainText}>Read Again 🔁</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleBackToStories}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>Back to Stories 📚</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  illustration: {
    width: 180,
    height: 180,
    borderRadius: 24,
    marginBottom: 24,
    backgroundColor: '#e0e0e0',
  },
  celebration: {
    fontSize: 56,
    marginBottom: 8,
  },
  heading: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FF6B35',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center',
  },
  readAgainButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  readAgainText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  homeButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  homeButtonText: {
    color: '#FF6B35',
    fontSize: 20,
    fontWeight: '800',
  },
});
