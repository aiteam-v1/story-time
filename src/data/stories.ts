import { Story } from '../types';

export const STORIES: Story[] = [
  {
    id: 'space-explorer',
    title: 'The Space Explorer',
    defaultCharacterName: 'Oliver',
    coverImage: require('../../assets/stories/space/cover.png'),
    pages: [
      {
        id: 'space-1',
        text: 'Oliver put on a shiny silver helmet. Today was the day — Oliver was going to fly to the moon!',
        image: require('../../assets/stories/space/page1.png'),
      },
      {
        id: 'space-2',
        text: 'Oliver climbed into the rocket and buckled the seatbelt. Three… two… one… BLAST OFF!',
        image: require('../../assets/stories/space/page2.png'),
      },
      {
        id: 'space-3',
        text: 'Up, up, up went Oliver, past the clouds and into the dark, sparkling sky. Stars winked hello.',
        image: require('../../assets/stories/space/page3.png'),
      },
      {
        id: 'space-4',
        text: 'Oliver landed the rocket with a gentle thud. The moon was grey and quiet. Oliver took one giant leap.',
        image: require('../../assets/stories/space/page4.png'),
      },
      {
        id: 'space-5',
        text: 'Oliver looked back at the tiny blue Earth and smiled. "I did it!" said Oliver. Time to go home.',
        image: require('../../assets/stories/space/page5.png'),
      },
    ],
  },
];
