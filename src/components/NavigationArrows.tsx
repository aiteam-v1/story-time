import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NavigationArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function NavigationArrows({ onPrev, onNext, hasPrev, hasNext }: NavigationArrowsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !hasPrev && styles.hidden]}
        onPress={onPrev}
        disabled={!hasPrev}
        activeOpacity={0.7}
      >
        <Text style={styles.arrow}>←</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.nextButton]}
        onPress={onNext}
        activeOpacity={0.7}
      >
        <Text style={styles.arrow}>{hasNext ? '→' : '🎉'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFF9F0',
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 40,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#FF6B35',
  },
  hidden: {
    opacity: 0,
  },
  arrow: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '700',
  },
});
