# slr.pics

## Current State
- Full-stack photography app with portfolio gallery, booking, client albums, availability calendar, and dashboard.
- Portfolio grid links to detail pages; no lightbox.
- Landing page has hero, features, featured work, and CTA section but no testimonials.
- Booking confirmation page exists at /book/confirmation but only mentions email follow-up.
- No watermark protection on portfolio images.
- No testimonials section or management.
- No Instagram feed/link section on landing page.

## Requested Changes (Diff)

### Add
- **Gallery lightbox**: Clicking a portfolio photo in PortfolioGalleryPage opens a full-screen modal overlay showing the full image with prev/next navigation and close button. (No change to PortfolioDetailPage routing — gallery grid opens lightbox instead of navigating away).
- **Watermark overlay**: CSS text watermark "slr.pics" displayed diagonally across all portfolio images in the gallery grid and lightbox to protect work. Semi-transparent, repeated pattern.
- **Testimonials section on LandingPage**: Show approved testimonials between Featured Work and CTA. Backend-managed: photographer approves/hides testimonials from dashboard. Clients cannot submit — photographer adds them manually.
- **Testimonials dashboard management**: New section in DashboardHomePage and a TestimonialsManagerPage at /dashboard/testimonials for adding, editing, approving, and deleting testimonials.
- **Instagram section on LandingPage**: A styled "Follow Along" section near the bottom with a prominent link to https://www.instagram.com/_slr.pics_ and a visual call-to-action. No actual API embed — just a well-designed promotional block.
- **Improved booking confirmation page**: Update text to reference phone/text/DM contact methods (matching the booking form options), include phone number 225-910-2426, and remove mention of "email" as the follow-up method.

### Modify
- `PortfolioGalleryPage`: Replace `<Link>` navigation with lightbox open handler for grid items.
- `LandingPage`: Add testimonials section and Instagram section.
- `BookingConfirmationPage`: Update contact info to reflect phone/text/DM options.
- `DashboardHomePage`: Add Testimonials card.
- `App.tsx`: Add /dashboard/testimonials route.

### Remove
- Nothing removed.

## Implementation Plan
1. Add Testimonial type and CRUD + approval backend methods via generate_motoko_code.
2. Frontend: implement lightbox component with watermark overlay.
3. Frontend: wire lightbox into PortfolioGalleryPage.
4. Frontend: add testimonials section to LandingPage using useGetApprovedTestimonials query.
5. Frontend: build TestimonialsManagerPage for dashboard.
6. Frontend: add Testimonials card to DashboardHomePage.
7. Frontend: add Instagram section to LandingPage.
8. Frontend: update BookingConfirmationPage text.
9. Frontend: add new queries/mutations for testimonials in useQueries.ts.
10. Frontend: add /dashboard/testimonials route in App.tsx.
