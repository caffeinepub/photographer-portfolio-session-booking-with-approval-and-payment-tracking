# slr.pics

## Current State
Portfolio, Contact, ClientAlbums, BookingConfirmation, and PortfolioDetail pages exist with no shared bottom CTA section. BookingPage has a form with contact info, sport selection, date/time, location, and notes — no preferred contact method field and no pricing display.

## Requested Changes (Diff)

### Add
- Reusable PageCTABar component: three buttons — Book Now (/book), Check Availability (/book), Get Your Photos (/client-albums) — shown at the bottom of every page except LandingPage and BookingPage.
- BookingPage: Preferred Contact Method field (radio or select) with options: DM on Instagram, Text Message, Email. Selection appended to notes on submit.
- BookingPage: pricing callout "Sports sessions start at $20" near the top.

### Modify
- PortfolioGalleryPage, ContactPage, ClientAlbumsPage, BookingConfirmationPage, PortfolioDetailPage: add PageCTABar at the bottom.
- BookingPage: add pricing note and preferred contact method field.

### Remove
- Nothing.

## Implementation Plan
1. Create src/frontend/src/components/PageCTABar.tsx with the three CTA buttons.
2. Add PageCTABar to the five non-home pages.
3. Update BookingPage with pricing callout and contact method field.
