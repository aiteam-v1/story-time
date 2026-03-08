import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Placeholder — full implementation in issue #16 (layout) and #17 (TTS/auto-advance)
export default function StoryReaderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>StoryReader — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9F0' },
  text: { fontSize: 18, color: '#999' },
});
