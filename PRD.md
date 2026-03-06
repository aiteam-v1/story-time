# PRD: Kids Story Reading App

## 1. Overview
**Product Name:** StoryTime (Working Title)
**Platform:** React Native (iOS & Android)
**Target Audience:** Parents reading to children (ages 3-7) and early readers.

**Core Value:** A simple, distraction-free reading experience that makes the child the hero of the story by dynamically replacing character names.

## 2. Problem Statement
Kids engage more deeply when they see themselves in the story. Customizing physical books is expensive and slow. Existing apps are often cluttered with gamification that distracts from the reading experience.

## 3. User Flow
1.  **Home Screen:**
    *   User sees a vertical list of available stories.
    *   Each item shows a thumbnail and title.
    *   *Constraint:* Stories are hardcoded in the app for v1 (no backend).

2.  **Story Selection:**
    *   User taps a story.
    *   **Popup/Modal appears:**
        *   Text: "This story is about [Default Name]. Who should be the hero?"
        *   Input Field: [ Enter Name ] (Default is empty or placeholder).
        *   Action Buttons: "Start Reading" (uses input name) | "Cancel".
        *   *Logic:* If input is empty, use the default story character name.

3.  **Reading Experience:**
    *   **Layout:** Split screen. Top 50% = Illustration. Bottom 50% = Text (3-4 sentences).
    *   **Name Replacement:** Every instance of the [Default Name] in the text is replaced by the [User Input Name].
    *   **Audio:** Text-to-Speech (TTS) engine reads the text aloud immediately upon loading the page.
    *   **Navigation:**
        *   Big "Next" arrow to advance.
        *   "Back" arrow to return to previous page.
        *   "Home" icon (top corner) to exit.

4.  **End of Story:**
    *   Final illustration.
    *   "Read Again" or "Back to Stories" buttons.

## 4. Functional Requirements

### FR1: Story Data Structure (JSON)
Stories must be stored locally in a JSON format containing:
*   `id`: unique string
*   `title`: string
*   `defaultCharacterName`: string (the name to find and replace)
*   `pages`: array of objects
    *   `image`: local asset path
    *   `text`: string (sentences)

### FR2: Name Injection
*   The app must perform a case-insensitive find-and-replace on the story text before rendering.
*   The replaced name must match the casing of the surrounding sentence (Capitalized at start, etc. - for v1 simple string replacement is acceptable if we assume names are always capitalized).

### FR3: Audio (TTS)
*   Use native platform TTS (Expo Speech or React Native TTS).
*   Must read the *modified* text (with the child's name).
*   Audio starts automatically when page loads.
*   Stop audio if user navigates away/forward.

## 5. Non-Functional Requirements
*   **Performance:** Instant page turns.
*   **Offline:** App must work 100% offline.
*   **UI/UX:** Large buttons, kid-friendly fonts, high contrast.

## 6. Out of Scope (v1)
*   Backend/API fetching (stories are local).
*   User accounts/login.
*   Saving custom names for next time.
*   Voice recording (custom narration).
*   Complex animations.
*   In-app purchases.

## 7. Success Metrics
*   Successful story completion (reaching the last page).
*   Re-read rate (opening the same story again).
