# slr.pics

## Current State
The home page (LandingPage.tsx) has:
- Hero section with background image, headline, and two CTA buttons
- Specialties section (text rows for Baseball, Basketball, Football)
- Featured Work grid (shows 3 portfolio items)
- Testimonials grid (when data exists)
- Submit a Review form section
- CTA section (dark primary background with booking prompt)
- Social Follow section (Instagram + TikTok buttons)

Issues:
- Hero headline is generic/AI-sounding
- No immediate visual identity or name
- Specialties section is sparse and minimal
- Featured Work grid doesn't show well when empty
- Submit a Review form is buried at the bottom and blends in
- CTA section is repetitive with hero CTAs
- No visual hook or personality — feels bland

## Requested Changes (Diff)

### Add
- Photographer name "Slade Robert" and brand "slr.pics" prominently in the hero
- A brief tagline that communicates what makes this photographer different (local Louisiana sports photographer)
- A visual stats/badge bar (e.g., sports covered, years active, etc.) right below hero
- Better visual separation between sections
- "Book a Session" secondary CTA added near the specialties section

### Modify
- Hero headline to be more personal and bold — include the photographer's name
- Specialties rows to include a small icon or visual cue per sport, and a "Book [sport]" link
- Featured Work section to always show (fallback text if empty)
- Testimonials section to feel more editorial/magazine-style
- Review form section to stand out more clearly with better contrast
- CTA section to feel more premium (better copy, cleaner layout)
- Social follow section to match the overall dark aesthetic better

### Remove
- Redundant or generic marketing language
- Excessive whitespace in empty states

## Implementation Plan
1. Update LandingPage.tsx hero: add photographer name + tagline + more personal copy
2. Add a subtle stats bar (sports covered, sessions booked, etc.) below hero
3. Improve specialties section rows with sport-specific icons (lucide icons)
4. Add Book button to specialties section
5. Improve featured work section with better fallback when no photos
6. Make testimonials section feel more editorial
7. Polish review form and CTA sections
8. Keep all existing data hooks and backend connections intact
