# slr.pics

## Current State
Testimonials are displayed on the home page in a 'What Clients Say' section. Only the admin (photographer) can create testimonials via the dashboard. The dashboard Testimonials Manager lets you add, approve/disapprove, and delete testimonials.

## Requested Changes (Diff)

### Add
- Public `submitTestimonial` backend function (no auth required) that stores a testimonial with `approved = false`
- `useSubmitTestimonial` hook in useQueries.ts
- Public submission form on the LandingPage below the testimonials section, allowing anyone to submit their name, quote, and optional sport. Shows a thank-you message after submission.
- Pending testimonials section in the dashboard TestimonialsManagerPage, clearly separated from approved ones with approve/reject controls.

### Modify
- Backend `main.mo`: add `submitTestimonial` public shared func
- `backend.d.ts`: add `submitTestimonial` to interface
- `useQueries.ts`: add `useSubmitTestimonial` mutation
- `LandingPage.tsx`: add testimonial submission form section
- `TestimonialsManagerPage.tsx`: split list into Pending (unapproved) and Approved tabs/sections

### Remove
- Nothing removed

## Implementation Plan
1. Add `submitTestimonial` to backend main.mo
2. Add `submitTestimonial` to backend.d.ts interface
3. Add `useSubmitTestimonial` hook to useQueries.ts
4. Add submission form section to LandingPage below testimonials
5. Update TestimonialsManagerPage to show pending items prominently with approve button
