# slr.pics

## Current State
The app has a `/contact` page combining both an "About the Photographer" bio section and contact info cards (phone, email, Instagram, TikTok). The `PageCTABar` has 4 buttons: Book Now, Check Availability, Client Photos, Leave a Review — all styled the same. The overall UI has a polished but generic AI-generated feel (heavy gradients, rounded cards everywhere, formulaic layouts).

## Requested Changes (Diff)

### Add
- New `/about` route and `AboutPage.tsx` — contains profile picture, bio/about section (moved from ContactPage)
- "Contact" button in `PageCTABar`, positioned to the RIGHT of all existing buttons, visually separated (e.g., a thin vertical divider or extra gap + distinct border styling) so it stands out as its own bordered group

### Modify
- `ContactPage.tsx`: Remove the bio/about section entirely. Only show contact info: phone, email, Instagram, TikTok. Simplify layout — no heavy gradient backgrounds, less rounded styling, cleaner and more editorial
- `PageCTABar.tsx`: Add Contact button on the far right, bordered by itself (visually distinct from the group of 4 buttons to its left)
- `SiteHeader.tsx`: Rename "Contact" nav link to "About", pointing to `/about`. Add "Contact" somewhere in nav or keep it accessible via the CTA bar
- `App.tsx`: Add `/about` route using the new `AboutPage`; update `/contact` route to use the stripped-down `ContactPage`
- Overall UI cleanup: reduce AI-generic feel — flatten gradients, reduce excessive card rounding, simplify section spacing, use cleaner typography without heavy serif everywhere

### Remove
- Bio/about section from `ContactPage.tsx` (moved to `AboutPage.tsx`)

## Implementation Plan
1. Create `AboutPage.tsx` with profile picture (concert photo), bio from CONTACT_INFO, and clean editorial layout
2. Rewrite `ContactPage.tsx` to be contact-info only (phone, email, Instagram, TikTok) — clean, simple, not overly card-heavy
3. Update `PageCTABar.tsx`: add Contact button (`<Link to="/contact">`) to the right, separated visually from the other 4 buttons
4. Update `SiteHeader.tsx`: nav "Contact" → "About" linking to `/about`; optionally add Contact link too
5. Update `App.tsx`: add `/about` route with `AboutPage`, keep `/contact` route
6. Clean up overall UI: reduce gradient overuse, simplify card styles, make it feel like a real photographer's site not a template
