import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Placeholder — full implementation in issue #14
export default function HeroInputScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>HeroInput — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9F0' },
  text: { fontSize: 18, color: '#999' },
});
