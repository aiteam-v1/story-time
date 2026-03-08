import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { STORIES } from '../data/stories';
import { injectName } from '../utils/nameInjection';
import PageView from '../components/PageView';
import NavigationArrows from '../components/NavigationArrows';

type StoryReaderNav = NativeStackNavigationProp<RootStackParamList, 'StoryReader'>;
type StoryReaderRoute = RouteProp<RootStackParamList, 'StoryReader'>;

export default function StoryReaderScreen() {
  const navigation = useNavigation<StoryReaderNav>();
  const { params } = useRoute<StoryReaderRoute>();
  const { storyId, heroName } = params;

  const story = STORIES.find((s) => s.id === storyId);
  const [pageIndex, setPageIndex] = useState(0);

  if (!story) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Story not found.</Text>
      </View>
    );
  }

  const currentPage = story.pages[pageIndex];
  const injectedText = injectName(
    currentPage.text,
    story.defaultCharacterName,
    heroName
  );

  const handleNext = () => {
    if (pageIndex < story.pages.length - 1) {
      setPageIndex(pageIndex + 1);
    } else {
      navigation.navigate('StoryEnd', { storyId, heroName });
    }
  };

  const handlePrev = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleHome = () => {
    Alert.alert(
      'Leave story?',
      'Your place will not be saved.',
      [
        { text: 'Keep reading', style: 'cancel' },
        {
          text: 'Go home',
          style: 'destructive',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleHome} style={styles.homeButton}>
          <Text style={styles.homeIcon}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.pageCounter}>
          {pageIndex + 1} / {story.pages.length}
        </Text>
      </View>

      <PageView page={currentPage} injectedText={injectedText} />

      <NavigationArrows
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={pageIndex > 0}
        hasNext={pageIndex < story.pages.length - 1}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF9F0',
  },
  homeButton: {
    padding: 8,
  },
  homeIcon: {
    fontSize: 28,
  },
  pageCounter: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
  },
});
