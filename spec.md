# slr.pics

## Current State
- App has a booking page at `/book` for sports sessions
- The CTA bar has a "Check Availability" button that links to `/book` (wrong)
- No dedicated availability page exists
- Dashboard has no availability management section

## Requested Changes (Diff)

### Add
- New public page `/availability` showing a calendar of available/unavailable dates
- New dashboard page `/dashboard/availability` to mark dates as available or unavailable
- Backend functions: `getUnavailableDates()` (public query) and `setUnavailableDates(dates: [Text])` (admin only)
- Dashboard card linking to availability manager in DashboardHomePage

### Modify
- `PageCTABar.tsx`: Update "Check Availability" button to link to `/availability` instead of `/book`
- `App.tsx`: Register new routes for `/availability` and `/dashboard/availability`
- `DashboardHomePage.tsx`: Add "Availability" quick-action card
- `backend/main.mo`: Add `unavailableDates` variable and getter/setter
- `backend.did.d.ts` and `backend.did.js`: Add new method signatures
- `useQueries.ts`: Add `useGetUnavailableDates` and `useSetUnavailableDates` hooks

### Remove
- Nothing removed

## Implementation Plan
1. Add `unavailableDates` var to backend, with `getUnavailableDates` (public query) and `setUnavailableDates` (admin-only update)
2. Update declarations and hooks
3. Create `AvailabilityPage.tsx` — calendar UI, read-only for public, shows green (available) and red/gray (unavailable) days
4. Create `AvailabilityManagerPage.tsx` — calendar UI for admin to click and toggle days unavailable/available, save button
5. Add routes and dashboard card
6. Fix CTA bar link
