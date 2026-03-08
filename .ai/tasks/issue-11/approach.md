# Approach: Issue #11 — Init Expo Project

## Understanding
Bootstrap the repo with a working Expo managed project using the TypeScript template. Set up ESLint + Prettier, install React Navigation (stack), and wire up a placeholder HomeScreen so the app boots and navigates correctly.

## Plan
1. `npx create-expo-app@latest . --template expo-template-blank-typescript` inside the repo root
2. Install React Navigation + Expo peer deps
3. Configure ESLint + Prettier
4. Create `src/navigation/AppNavigator.tsx` with a single Stack screen → stub HomeScreen
5. Create `src/screens/HomeScreen.tsx` placeholder
6. Update `App.tsx` to render `<AppNavigator />`
7. Update `app.json`: name = "StoryTime"

## Edge Cases
- Expo template generates flat structure; reorganize into `src/` per tech doc
- `react-native-screens` needs `enableScreens()` in App.tsx

## Uncertainty
- Can't run on simulator, will verify via `tsc --noEmit`
