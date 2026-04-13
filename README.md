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

## Changelog

### 2026-04-13 — VentureSpark Tailoring (LINE Research Integration)

Tailored the deck for the VentureSpark + LINE SCALE UP event using findings from Palm's 17-group LINE staffing market analysis (37K posted shifts, 8 months of data).

**Global:**
- Added vein logo to top-left of slides 2-15 (ivory on dark, navy on light backgrounds)

**Content changes:**
- **Slide 2 (Problem):** Removed 30-40% agency markup stat; updated research quote from "289K lines / 5 groups" to "37K posted shifts / 17 LINE groups / 8 months"
- **Slide 3 (Solution):** "Verified" → "On-demand" header; replaced screenshot with new UI
- **Slide 4 (Why Now):** Removed "LINE is the distribution unlock" callout
- **Slide 6 (Business Model):** Added "(nurse job only)" to Avg shift and Revenue/shift labels; added scaling points (AI/automation, scalability, volume, data-driven)
- **Slide 7 (Traction):** Streamlined from 8 to 5 bullets; updated competitive intelligence text; added survey bullet
- **Slide 8 (Competition):** Replaced "vein" text with logo in table header; "LINE Groups" → "LINE Groups/Webboard"
- **Slide 10 (The Ask):** Rewrote 4 benefit cards with LINE research data anchors; removed milestones timeline
- **Slide 11 (A1):** Added clarifying subtitle linking demand drivers to TAM/SAM/SOM
- **Slide 12 (A2):** Removed Health at Home (defunct); added V Nurse Care

## Tech

- Vanilla HTML/CSS/JS (no build step)
- GSAP 3 + ScrollTrigger (CDN)
- Anuphan font (Google Fonts)
