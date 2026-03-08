import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { STORIES } from '../data/stories';

type HeroInputNav = NativeStackNavigationProp<RootStackParamList, 'HeroInput'>;
type HeroInputRoute = RouteProp<RootStackParamList, 'HeroInput'>;

export default function HeroInputScreen() {
  const navigation = useNavigation<HeroInputNav>();
  const { params } = useRoute<HeroInputRoute>();
  const { storyId } = params;

  const story = STORIES.find((s) => s.id === storyId);
  const defaultName = story?.defaultCharacterName ?? 'Hero';

  const [heroName, setHeroName] = useState('');

  const handleStart = () => {
    const name = heroName.trim() || defaultName;
    navigation.navigate('StoryReader', { storyId, heroName: name });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centerer}
      >
        <View style={styles.card}>
          {story && <Text style={styles.storyTitle}>{story.title}</Text>}
          <Text style={styles.prompt}>Who should be the hero? 🦸</Text>

          <TextInput
            style={styles.input}
            placeholder={defaultName}
            placeholderTextColor="#aaa"
            value={heroName}
            onChangeText={setHeroName}
            autoFocus
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={handleStart}
          />

          <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>Start Reading 📖</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  storyTitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  prompt: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 12,
    padding: 14,
    fontSize: 20,
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
  },
});
