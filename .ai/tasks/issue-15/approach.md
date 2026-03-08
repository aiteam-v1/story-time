# Approach: Issue #15 — Name Injection Utility

## Understanding
Implement `injectName(text, defaultName, heroName)` with case-preserving global regex replacement. Returns original text if heroName is empty/whitespace.

## Plan
1. `src/utils/nameInjection.ts` — function as designed in tech doc
2. `src/utils/__tests__/nameInjection.test.ts` — Jest tests covering all AC

## Edge Cases
- Trim heroName before use
- Both capitalized and lowercase match patterns handled
- Empty defaultName not a real scenario but noted

## Uncertainty
- None
