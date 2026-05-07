# Ether Landing Page

## Project
Ether landing page and waitlist — single-page React app deployed on Vercel at ether-landing-kappa.vercel.app. Brand-aligned with the Ether app (same tokens, same motion, same components).

## Stack
- React 19 + Vite 8
- Tailwind v4 (`@tailwindcss/vite`) + `tw-animate-css`
- TypeScript for new components (.tsx); legacy entry can stay .jsx
- Supabase waitlist backend (do not refactor `src/lib/supabase.js`)
- Stripe checkout link for Founding Member (existing URL, do not rebuild)
- `react-force-graph-2d` + `d3-force` for the static Mind Map render

## Design System
- Background `#060913` (`--ether-bg0`); ink `#F3F5FF` (`--ether-ink0`)
- Three-corner aurora wash (violet / cyan / magenta) on the page frame
- Primary accent: violet `#8A7CFF` (`--ether-violet`) — every CTA, every primary action
- 4-color meaning system:
  - cyan `#3DD9FF` = memory
  - violet `#8A7CFF` = insight / primary
  - magenta `#FF6FD1` = value
  - gold `#FFD27A` = earned / achievement / Founding Member
- Fonts: Space Grotesk (display/headings), Source Serif 4 (editorial body), Inter (UI)
- Glassmorphism cards: `bg-white/[0.02]`–`bg-white/[0.06]`, `border-white/10`, `backdrop-blur-md`
- Motion language: `etherBreathe` (radial cores), `etherSpin` (orbits), `float-in`, `card-pulse-violet`, `avatar-float`, `avatar-ping`

## Architecture
- Multi-file component layout permitted (and expected)
- `src/components/ether/` — lifted from the Ether app (`BreathingCore`, `BreathingDot`, `EtherButton`, `StatusPill`, `EtherPageFrame`, `MindMapStatic`)
- `src/components/` — `EtherOrb`, `DashboardParts` (BrainRingsViz, StatCard, StreakCard, etc.)
- `src/companion/` — Brain Companion (stripped of trpc/wouter coupling)
- `src/sections/` — landing-page sections (Wound, Bridge, Future, Build, Ask)
- `src/lib/utils.ts` — `cn` helper
- `src/lib/supabase.js` — DO NOT refactor; waitlist insert exactly as the original
- Single source of truth for design tokens: `src/index.css` (mirrored from the Ether app's `client/src/index.css`)

## Brand Messaging
- Tagline: "The End of Disappearing"
- Sub-tagline: "Your Digital Mind. Living Forever."
- Pillars: Remember Everything / Know Yourself Deeper / Live Beyond Your Lifetime
- Alive-first positioning: lead with daily utility, legacy is the long game
- The word "death" never appears on the page
- Voice: direct, present-tense, slightly poetic. Never therapeutic. Never corporate.

## Key Rules
- Mobile-first: test at 375px and 390px widths. No horizontal scroll.
- Never use tech jargon above the fold
- No price visible anywhere on the page (FM tier mentioned, price revealed only after FM CTA click)
- Night mode default; no day/night toggle on this page

## Founder
Chase Empson (@CWEMPS on X) — NZ-based founder, building Ether because generational knowledge disappears when people pass.
