import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { StoryPage } from '../types';

const { height } = Dimensions.get('window');

interface PageViewProps {
  page: StoryPage;
  injectedText: string;
}

export default function PageView({ injectedText, page }: PageViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={page.image} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{injectedText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    height: height * 0.6,
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    padding: 24,
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    lineHeight: 34,
    color: '#222',
    fontWeight: '500',
    textAlign: 'center',
  },
});
