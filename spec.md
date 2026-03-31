# slr.pics

## Current State
Testimonials were removed entirely from the frontend after persistent submission errors. The backend still has all testimonial functions intact:
- `submitTestimonial(clientName, quote, sport)` — public, no auth required
- `getApprovedTestimonials()` — public query
- `getAllTestimonials()` — admin only
- `toggleTestimonialApproval(id)` — admin only
- `deleteTestimonial(id)` — admin only

TestimonialsManagerPage.tsx currently just shows a placeholder message. LandingPage.tsx has no testimonial section. useQueries.ts has no testimonial hooks.

## Requested Changes (Diff)

### Add
- Testimonial hooks in useQueries.ts: `useGetApprovedTestimonials`, `useSubmitTestimonial`, `useGetAllTestimonials`, `useToggleTestimonialApproval`, `useDeleteTestimonial`
- Testimonials display section on LandingPage.tsx — shows approved testimonials (name + quote only, no sport)
- Testimonial submission form on LandingPage.tsx — just two fields: Name and Message; passes `null` for sport
- Functional TestimonialsManagerPage.tsx — lists all testimonials with approve/unapprove toggle and delete button
- Testimonials quick-action card on DashboardHomePage.tsx

### Modify
- LandingPage.tsx: add the testimonials section between Featured Work and the CTA section
- TestimonialsManagerPage.tsx: replace placeholder with working management UI
- DashboardHomePage.tsx: add a Testimonials management card in the Quick Actions grid
- useQueries.ts: add testimonial hooks

### Remove
- Nothing

## Implementation Plan
1. Add testimonial hooks to useQueries.ts — `useGetApprovedTestimonials` (public query, no auth), `useSubmitTestimonial` (mutation, no auth, sport=null always), `useGetAllTestimonials` (admin query), `useToggleTestimonialApproval` (admin mutation), `useDeleteTestimonial` (admin mutation)
2. Update LandingPage.tsx — add a "What Clients Say" section showing approved testimonials, then a simple form below it with Name + Message fields and a Submit button; on success show a thank-you message
3. Rewrite TestimonialsManagerPage.tsx — table/list of all testimonials with name, message, approved status, and action buttons (approve/unapprove, delete)
4. Update DashboardHomePage.tsx — add Testimonials card with a link to /dashboard/testimonials
