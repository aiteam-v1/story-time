import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as Speech from 'expo-speech';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { STORIES } from '../data/stories';
import { injectName } from '../utils/nameInjection';
import PageView from '../components/PageView';
import NavigationArrows from '../components/NavigationArrows';

type StoryReaderNav = NativeStackNavigationProp<RootStackParamList, 'StoryReader'>;
type StoryReaderRoute = RouteProp<RootStackParamList, 'StoryReader'>;

const AUTO_ADVANCE_DELAY_MS = 2500;

export default function StoryReaderScreen() {
  const navigation = useNavigation<StoryReaderNav>();
  const { params } = useRoute<StoryReaderRoute>();
  const { storyId, heroName } = params;

  const story = STORIES.find((s) => s.id === storyId);
  const [pageIndex, setPageIndex] = useState(0);

  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks which page index started the current speech session.
  // If pageIndex changes before onDone fires, the callback is stale and discarded.
  const speechPageRef = useRef<number>(-1);

  const clearTimerAndSpeech = useCallback(() => {
    Speech.stop();
    speechPageRef.current = -1;
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!story) return;

    const currentPage = story.pages[pageIndex];
    const injectedText = injectName(
      currentPage.text,
      story.defaultCharacterName,
      heroName
    );
    const isLastPage = pageIndex === story.pages.length - 1;

    // Record which page owns this speech session
    speechPageRef.current = pageIndex;
    const ownedPage = pageIndex;

    Speech.stop();
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }

    Speech.speak(injectedText, {
      onDone: () => {
        // Guard: discard if user already navigated away from this page
        if (speechPageRef.current !== ownedPage) return;
        if (!isLastPage) {
          autoAdvanceTimer.current = setTimeout(() => {
            // Double-check guard inside the timer too
            if (speechPageRef.current === ownedPage) {
              setPageIndex((prev) => prev + 1);
            }
          }, AUTO_ADVANCE_DELAY_MS);
        }
      },
      onStopped: () => {
        if (autoAdvanceTimer.current) {
          clearTimeout(autoAdvanceTimer.current);
          autoAdvanceTimer.current = null;
        }
      },
    });

    return () => {
      clearTimerAndSpeech();
    };
  }, [pageIndex, story, heroName, clearTimerAndSpeech]);

  // Stop everything on screen unmount
  useEffect(() => {
    return () => {
      clearTimerAndSpeech();
    };
  }, [clearTimerAndSpeech]);

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
    clearTimerAndSpeech();
    if (pageIndex < story.pages.length - 1) {
      setPageIndex(pageIndex + 1);
    } else {
      navigation.navigate('StoryEnd', { storyId, heroName });
    }
  };

  const handlePrev = () => {
    clearTimerAndSpeech();
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
          onPress: () => {
            clearTimerAndSpeech();
            navigation.navigate('Home');
          },
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
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF9F0',
  },
  homeButton: { padding: 8 },
  homeIcon: { fontSize: 28 },
  pageCounter: { fontSize: 16, color: '#999', fontWeight: '600' },
  error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: '#999' },
});
