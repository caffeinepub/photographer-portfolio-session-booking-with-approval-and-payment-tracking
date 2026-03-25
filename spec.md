# slr.pics

## Current State
Home page hero has a hardcoded background image. No dashboard control to change it.

## Requested Changes (Diff)

### Add
- Backend: heroBackgroundUrl variable with getHeroBackground query and setHeroBackground admin mutation
- useGetHeroBackground and useSetHeroBackground hooks
- Dashboard Home Background upload card

### Modify
- LandingPage: use backend hero URL with fallback to generated image
- DashboardHomePage: add Home Background card

### Remove
- Nothing

## Implementation Plan
1. Update main.mo with hero background get/set
2. Add hooks to useQueries.ts
3. Update LandingPage.tsx to use backend URL
4. Add upload card to DashboardHomePage.tsx
