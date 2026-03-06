# StoryTime App Design

## Overview
A React Native app for kids that dynamically replaces character names in stories and reads them aloud using Text-to-Speech (TTS).

## Architecture
We will use **React Native with Expo (Managed Workflow)** for rapid development and cross-platform compatibility.

### Core Stack
-   **Framework:** React Native + Expo
-   **Language:** TypeScript
-   **Navigation:** React Navigation (Stack Navigator)
-   **State Management:** React Context (for passing the custom character name)
-   **Text-to-Speech:** `expo-speech`
-   **Assets:** Local images bundled with the app

## Data Model
Since v1 has no backend, data will be stored in a `data/stories.ts` file exporting a typed array. This ensures type safety and easy migration to an API later.

```typescript
interface StoryPage {
  text: string;
  image: any; // Result of require('./path/to/image.png')
}

interface Story {
  id: string;
  title: string;
  coverImage: any;
  defaultCharacterName: string;
  pages: StoryPage[];
}
```

## Screen Flow & Components

1.  **HomeScreen**
    -   Displays a list of available stories using `FlatList`.
    -   Each item shows the cover image and title.
    -   On press -> Navigates to `StoryDetailScreen` (or opens the modal directly).

2.  **StoryDetailScreen (Optional / Modal)**
    -   Simple modal or screen where the user inputs the "Hero Name".
    -   Default value: `story.defaultCharacterName`.
    -   Action: "Start Reading" -> Navigates to `ReadingScreen` with `storyId` and `heroName` params.

3.  **ReadingScreen**
    -   **Layout:**
        -   Top 60%: `Image` component displaying the current page's illustration.
        -   Bottom 40%: `Text` component displaying the story text.
    -   **Logic:**
        -   **Name Replacement:** A helper function `replaceName(text, defaultName, heroName)` replaces all occurrences case-insensitively before rendering.
        -   **TTS:** `Speech.speak(processedText)` is called on mount and on page change.
        -   **Auto-Advance:**
            -   Listen to `onDone` callback from `Speech.speak`.
            -   Wait 2-3 seconds (`setTimeout`).
            -   Navigate to next page index.
    -   **Controls:**
        -   "Back" / "Next" buttons for manual override.
        -   "Home" button to exit (stops speech).

## Technical Considerations

### Text-to-Speech (TTS)
-   `expo-speech` is asynchronous. We must handle race conditions (e.g., user navigates away while speech is playing).
-   **Cleanup:** `Speech.stop()` must be called in `useEffect` cleanup function.

### Navigation
-   We'll use a simple Stack Navigator.
-   Routes: `Home`, `Reading`.
-   Params for `Reading`: `{ storyId: string, heroName: string }`.

### Asset Management
-   Images will be stored in `assets/images/stories/<story-id>/`.
-   We will use dynamic `require` statements in the data file, not in the component (React Native requires static image paths at compile time for `require`, so the data file approach is best).

## Implementation Plan
1.  **Setup**: Initialize Expo project with TypeScript.
2.  **Data**: Create `data/stories.ts` with dummy content and interfaces.
3.  **Navigation**: Set up React Navigation.
4.  **Home Screen**: Implement story list.
5.  **Reading Screen**: Implement layout, name replacement, and manual navigation.
6.  **TTS Integration**: Add `expo-speech` and auto-advance logic.
