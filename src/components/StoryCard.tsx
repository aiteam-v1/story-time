import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { Story } from '../types';

interface StoryCardProps {
  story: Story;
  onPress: () => void;
}

export default function StoryCard({ story, onPress }: StoryCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={story.coverImage} style={styles.cover} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title}>{story.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cover: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  info: {
    flex: 1,
    paddingLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
});
