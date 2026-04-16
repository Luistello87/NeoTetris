# Quorra — History

## Project Context
- **Project:** NeoTetris — Tetris game in pure HTML/CSS/JS, neo-brutalist design
- **User:** Brady
- **Stack:** HTML, CSS, JavaScript (zero dependencies)

## Learnings

### Design Review & Enhancement (Initial Pass)
- **Assessed** Tron's implementation against 10-point neo-brutalist checklist
- **Split** the single stats panel into 3 individual brutalist cards (Score, Lines, Level) — each with unique accent color border
- **Enhanced title** — larger clamp range (up to 4.5rem), yellow text on black, dual-color hard shadows (magenta + cyan), decorative cyan underline bar
- **Added color accent system** — 5 accent classes (magenta, cyan, yellow, green, orange) for left-border highlights on panels
- **Upgraded stat values** — each stat gets its own contrasting color for quick scanning
- **Improved buttons** — thicker borders (4px), wider letter-spacing, color-swap on active state (magenta bg flip)
- **Improved overlay** — yellow title with magenta text-shadow, cyan final score, better active states on overlay buttons
- **Improved controls panel** — flexbox rows for alignment, orange accent, yellow kbd text
- **Kept all game logic 100% untouched** — only CSS classes and HTML structure changes
- **Lesson:** Splitting stats into separate cards is the highest-impact brutalist move — gives each metric visual weight and breaks monotony
