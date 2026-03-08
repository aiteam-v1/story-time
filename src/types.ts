import { ImageSourcePropType } from 'react-native';

export interface StoryPage {
  id: string;
  text: string;
  image: ImageSourcePropType;
}

export interface Story {
  id: string;
  title: string;
  coverImage: ImageSourcePropType;
  defaultCharacterName: string;
  pages: StoryPage[];
}
