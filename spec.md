# slr.pics

## Current State
The booking page (`BookingPage.tsx`) is a single long scrollable form with all fields on one page — contact info, coverage details, notes, and contact method all stacked together. It works but can feel overwhelming. The confirmation page is a clean card.

## Requested Changes (Diff)

### Add
- Multi-step form UI with a progress indicator (Step 1: Your Info, Step 2: Event Details, Step 3: Review & Submit)
- Step-by-step navigation (Next/Back buttons between steps)
- Review step that shows a summary of all entered info before final submission
- Visual step progress bar/indicator at the top of the form

### Modify
- Split existing form fields into 3 logical steps:
  - Step 1: Full Name, Email, Phone, Preferred Contact Method (+ Instagram handle if DM selected)
  - Step 2: Sport, Event Date, Time, Venue/Location, Event Description, Additional Notes
  - Step 3: Read-only summary of all info with Submit button
- Improve field labels and helper text for clarity
- Confirmation page: add clearer summary of what was submitted (sport type, date, contact method)

### Remove
- Nothing removed; just reorganized into steps

## Implementation Plan
1. Refactor `BookingPage.tsx` to a stepped form with local state tracking current step (0, 1, 2)
2. Add a step progress indicator at top (Step 1 of 3 style with visual dots or numbered steps)
3. Step 1: contact fields + contact method
4. Step 2: sport/event fields
5. Step 3: review summary (read-only) + submit button
6. Validation per step before allowing Next
7. Keep all existing submit logic and navigation to `/book/confirmation` intact
