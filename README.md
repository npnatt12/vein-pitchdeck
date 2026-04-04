# vein — Pitch Deck

Cinematic HTML pitch deck for Vein's Venture Spark x LINE SCALE UP Cohort 2 interview.

## Quick Start

Open `index.html` in Chrome or Safari. That's it — no build step, no server.

For the best experience, press **F** for fullscreen.

## Controls

### Navigation

| Key | Action |
|-----|--------|
| `→` `↓` `Space` | Next slide |
| `←` `↑` | Previous slide |
| `1`–`9`, `0` | Jump to slide 1–10 |
| `Home` | First slide |
| `End` | Last slide |
| `F` | Toggle fullscreen |
| `O` | Overview (all slides grid) |
| Click right 70% | Next slide |
| Click left 30% | Previous slide |

### Presenter Mode

| Key | Action |
|-----|--------|
| `P` | Toggle presenter overlay |
| `T` | Reset timer |
| `B` | Toggle progress bar |

Presenter overlay shows: slide counter, elapsed/remaining timer (5 min), speaker notes.
Auto-hides after 5 seconds, reappears on mouse/key activity.

## Slides

10 core slides + 5 appendix (accessible by pressing → past slide 10):

1. **Title** — vein: The operating system for healthcare staffing in Thailand
2. **Problem** — 51,400 nurse shortage, LINE chat chaos, agency markup
3. **Solution** — Verify → Match → Confirm → Pay → Trust pipeline
4. **Why Now** — Aging crisis + structural shortage + zero incumbents + LINE
5. **Market** — $590M SEA → $95-110M Thailand (MECE triangulation)
6. **Business Model** — 10-15% commission vs agency 30-40%
7. **Traction** — 289K lines analyzed, product built, distribution mapped
8. **Competition** — 329 healthtech startups, zero do this. Unicorn comparables.
9. **Team** — 2 MDs + 1 CTO
10. **The Ask** — What Venture Spark + LINE SCALE UP unlocks

**Appendix:** A1 Market Sizing · A2 Competitive Landscape · A3 Roadmap · A4 Unit Economics · A5 Go-to-Market

## Hosting

Drop the entire `vein-pitchdeck/` folder on any static host:
- Vercel: `vercel --prod`
- Netlify: drag-and-drop
- GitHub Pages: push to repo

## Tech

- Vanilla HTML/CSS/JS (no build step)
- GSAP 3 + ScrollTrigger (CDN)
- Anuphan font (Google Fonts)
