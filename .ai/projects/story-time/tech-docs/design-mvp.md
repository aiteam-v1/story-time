# Technical Design: StoryTime (MVP)

**PRD:** [PRD.md](../PRD.md)
**Status:** DRAFT
**Author:** Rayan (Architect)

## 1. Architecture Overview

We will build this as a **React Native** app using **Expo**. Expo is chosen for its speed of development, easy OTA updates, and built-in support for `expo-speech` (TTS) and `expo-av` (if needed later), which perfectly matches our requirements without complex native linking.

### High-Level Components
*   **Data Layer:** Static JSON file (`stories.json`) bundled with the app.
*   **State Management:** React Context (`StoryContext`) to manage the current story session (selected story + custom hero name).
*   **Navigation:** React Navigation (Stack Navigator).
*   **TTS Engine:** `expo-speech`.

## 2. Data Model (JSON Schema)

We need a structure that supports the "find and replace" logic and future API migration.

```typescript
// types.ts

export interface Page {
  id: string; // unique page ID for keying
  text: string; // The raw text with placeholders or original names
  image: any; // require('path/to/image') - for local assets
  // In v2, 'image' will be a URL string
}

export interface Story {
  id: string;
  title: string;
  coverImage: any; 
  defaultCharacterName: string; // The name we look for to replace
  pages: Page[];
}

// data/stories.ts (Simulating a DB)
export const STORIES: Story[] = [
  {
    id: "story-1",
    title: "The Space Explorer",
    defaultCharacterName: "Oliver",
    coverImage: require('../assets/stories/space/cover.png'),
    pages: [
      {
        id: "p1",
        text: "Oliver looked up at the stars. He wondered what was out there.",
        image: require('../assets/stories/space/page1.png')
      },
      // ...
    ]
  }
];
```

## 3. Core Logic: Name Injection

We will implement a utility function `injectHeroName(text, originalName, heroName)`.

*   **Logic:** simple case-insensitive global replace.
*   **Edge Case:** Capitalization. For v1, we will assume the input name should be Capitalized (e.g., "Waqas").
*   **Helper:** `const displayedText = text.replace(new RegExp(originalName, 'gi'), heroName);`

## 4. Navigation & State Flow

**Stack Navigator:**
1.  `HomeScreen`: Lists stories.
2.  `HeroSetupModal` (Transparent Modal or Dialog): Input for name.
3.  `StoryReaderScreen`: The main carousel/pager.

**State (`StorySession`):**
*   `currentStoryId`: string
*   `heroName`: string (defaults to `story.defaultCharacterName` if empty)

## 5. TTS & Auto-Advance Strategy

This is the trickiest part of the UX.

**Component: `StoryReaderScreen`**
*   **State:** `currentPageIndex` (number).
*   **Effect Hook:**
    1.  On mount (or page change), stop any current speech.
    2.  Construct the text to read (using `injectHeroName`).
    3.  Call `Speech.speak(text, { onDone: handleSpeechDone })`.
    4.  `handleSpeechDone`:
        *   Wait 2000ms (setTimeout).
        *   Check if we are on the last page.
        *   If not, `setCurrentPageIndex(prev => prev + 1)`.

**Safety:**
*   `useEffect` cleanup: `Speech.stop()` and `clearTimeout(timer)` to prevent ghosts speaking when user navigates away.

## 6. Implementation Plan (Task Breakdown)

### Phase 1: Foundation
1.  **Init Expo App:** Setup TypeScript, ESLint, Prettier, React Navigation.
2.  **Asset Structure:** Create folders for stories/images.
3.  **Data Mock:** Create `stories.ts` with the "Space Explorer" seed content.

### Phase 2: Core UI
4.  **Home Screen:** List view of stories.
5.  **Hero Input:** Simple modal to capture name. Pass to Reader via route params.

### Phase 3: The Reader Logic
6.  **Reader Layout:** Split screen (Image top, Text bottom).
7.  **Text Processing:** Implement the name replacement logic.
8.  **TTS & Auto-Nav:** Implement `expo-speech` hook with the `onDone` delay logic.

## 7. Tradeoffs & Decisions

*   **Why Expo?** No native code required for these features. Faster iteration.
*   **Why JSON?** Zero backend cost/latency for v1.
*   **Why Route Params vs Context?** For v1, passing `heroName` and `storyId` via navigation params is simpler than setting up a global Context provider. We'll use params.

## 8. Open Questions
*   *None at this stage.*

