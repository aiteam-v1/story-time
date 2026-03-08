# Technical Design: StoryTime MVP

**PRD:** [PRD.md](../../../../PRD.md)
**Status:** DRAFT
**Author:** Rayan (Architect)
**Date:** 2026-03-08

---

## 1. Architecture Overview

React Native app using Expo (managed workflow). No backend — all content bundled locally. The app is a single-concern reader: load story → inject name → render pages → speak text → auto-advance.

```
┌─────────────────────────────────────┐
│            App (Expo)               │
│                                     │
│  ┌───────────┐    ┌──────────────┐  │
│  │ Navigation│    │ StoryContext  │  │
│  │  (Stack)  │    │ (heroName,   │  │
│  │           │    │  storyId)    │  │
│  └─────┬─────┘    └──────┬───────┘  │
│        │                 │          │
│  ┌─────▼─────────────────▼───────┐  │
│  │         Screens               │  │
│  │  Home → HeroInput → Reader   │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────┐    ┌──────────────┐  │
│  │ stories/  │    │ expo-speech  │  │
│  │ (local    │    │ (TTS engine) │  │
│  │  JSON+    │    │              │  │
│  │  assets)  │    │              │  │
│  └───────────┘    └──────────────┘  │
└─────────────────────────────────────┘
```

### Stack
- **Framework:** React Native + Expo (managed)
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack Navigator)
- **State:** React Context for story session
- **TTS:** `expo-speech`
- **Assets:** Local images bundled via `require()`

### Why Expo?
No native modules needed. `expo-speech` wraps platform TTS. Managed workflow means no Xcode/Gradle headaches for v1. If we outgrow it, ejecting is straightforward.

## 2. Data Model

```typescript
// src/types.ts

interface StoryPage {
  id: string;
  text: string;
  image: ImageSourcePropType; // require('./path.png')
}

interface Story {
  id: string;
  title: string;
  coverImage: ImageSourcePropType;
  defaultCharacterName: string;
  pages: StoryPage[];
}
```

Stories live in `src/data/stories.ts` as a typed array export. Each story is self-contained — text + image references. No cross-story dependencies.

```typescript
// src/data/stories.ts
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
        text: 'Oliver put on his shiny silver helmet. It was time to fly to the moon!',
        image: require('../../assets/stories/space/page1.png'),
      },
      // ...
    ],
  },
];
```

**v2 migration path:** Replace `STORIES` export with an API call. The `Story` type stays the same — just swap `ImageSourcePropType` for `string` (URL) and use `<Image source={{ uri }}>`  instead of `require()`.

## 3. Core Logic: Name Injection

```typescript
// src/utils/nameInjection.ts

export function injectName(
  text: string,
  defaultName: string,
  heroName: string
): string {
  if (!heroName || heroName.trim() === '') return text;
  const regex = new RegExp(defaultName, 'gi');
  return text.replace(regex, (match) => {
    // preserve capitalization pattern of the original
    if (match[0] === match[0].toUpperCase()) {
      return heroName.charAt(0).toUpperCase() + heroName.slice(1);
    }
    return heroName.toLowerCase();
  });
}
```

Simple regex replace with case preservation. For v1, names in stories are always capitalized, so this handles the common case. Edge cases (possessives like "Oliver's") work naturally since we're doing substring replacement.

## 4. Screen Flow

```
HomeScreen → HeroInputModal → StoryReaderScreen → EndScreen
    │                                                  │
    └──────────────────────────────────────────────────┘
```

### 4.1 HomeScreen
- `FlatList` of stories
- Each row: cover thumbnail + title
- Tap → navigate to `HeroInput` with `storyId` param

### 4.2 HeroInputModal
- Shows story title + "Who should be the hero?"
- Single text input, placeholder: story's `defaultCharacterName`
- "Start Reading" button → navigate to `StoryReader` with `{ storyId, heroName }`
- If input empty, pass `defaultCharacterName` as `heroName`

### 4.3 StoryReaderScreen
- Split layout: image (top 60%), text (bottom 40%)
- Text shows the name-injected version
- TTS reads on page load
- Navigation: large ← → arrows + auto-advance after TTS completes
- Home icon (top-left) → confirm exit → HomeScreen

### 4.4 EndScreen
- Final illustration
- "Read Again" (restart same story with same name) or "Back to Stories" (HomeScreen)

## 5. TTS & Auto-Advance

This is the trickiest piece — getting the lifecycle right so speech doesn't leak across pages.

```typescript
// Inside StoryReaderScreen

const [pageIndex, setPageIndex] = useState(0);
const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  const page = story.pages[pageIndex];
  const text = injectName(page.text, story.defaultCharacterName, heroName);

  // stop any in-flight speech + timer
  Speech.stop();
  if (timerRef.current) clearTimeout(timerRef.current);

  Speech.speak(text, {
    language: 'en',
    onDone: () => {
      // auto-advance after delay, unless last page
      if (pageIndex < story.pages.length - 1) {
        timerRef.current = setTimeout(() => {
          setPageIndex(prev => prev + 1);
        }, 2500); // 2.5s pause feels natural
      }
    },
  });

  return () => {
    Speech.stop();
    if (timerRef.current) clearTimeout(timerRef.current);
  };
}, [pageIndex]);
```

**Key behaviors:**
- Manual nav (← →) cancels current speech + timer, starts fresh
- Leaving the screen cleans up via effect cleanup
- Last page: TTS finishes, no auto-advance, user sees end-of-story buttons
- Auto-advance delay: 2.5s (long enough to look at the picture, short enough to keep flow)

## 6. Navigation Setup

```typescript
// src/navigation/AppNavigator.tsx

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="HeroInput"
        component={HeroInputScreen}
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen name="StoryReader" component={StoryReaderScreen} />
      <Stack.Screen name="StoryEnd" component={StoryEndScreen} />
    </Stack.Navigator>
  );
}
```

No deep linking, no tabs, no drawers. A simple linear stack.

## 7. Project Structure

```
story-time/
├── assets/
│   └── stories/
│       └── space/
│           ├── cover.png
│           ├── page1.png
│           ├── page2.png
│           └── ...
├── src/
│   ├── types.ts
│   ├── data/
│   │   └── stories.ts
│   ├── utils/
│   │   └── nameInjection.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── HeroInputScreen.tsx
│   │   ├── StoryReaderScreen.tsx
│   │   └── StoryEndScreen.tsx
│   └── components/
│       ├── StoryCard.tsx          # home screen list item
│       ├── PageView.tsx           # image + text layout
│       └── NavigationArrows.tsx   # ← → buttons
├── App.tsx
├── app.json
└── package.json
```

## 8. Tradeoffs & Decisions

| Decision | Why | Alternative considered |
|---|---|---|
| Expo managed | No native code needed, faster dev | Bare RN — unnecessary complexity for v1 |
| Local JSON data | Zero infra, works offline | SQLite — overkill, no queries needed |
| Route params for state | Simple, 3 screens | Redux/Zustand — way too heavy |
| expo-speech | Built into Expo, no linking | react-native-tts — requires ejecting |
| Simple regex replace | Works for v1's predictable data | NLP/tokenizer — over-engineering |
| No persistent state | Nothing to save in v1 | AsyncStorage — no use case yet |

## 9. Risks & Mitigations

- **TTS quality varies by device.** Some Android devices have poor default voices. Mitigation: nothing for v1 — this is an OS-level concern. v2 could use a cloud TTS API for consistent quality.
- **Large asset bundles.** Each story adds ~1-2MB of images. With 5-10 stories that's 10-20MB. Fine for v1. v2 would download stories on-demand.
- **Name injection edge cases.** If a story uses the character name as part of another word (e.g., "Oliver" in "Olive"), the regex would match. Mitigation: content authors avoid this in story text. Could add word-boundary matching (`\b`) if it becomes an issue.

## 10. Open Questions

None — design is straightforward for the MVP scope.
