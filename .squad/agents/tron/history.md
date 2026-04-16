# Tron — History

## Project Context
- **Project:** NeoTetris — Tetris game in pure HTML/CSS/JS, neo-brutalist design
- **User:** Brady
- **Stack:** HTML, CSS, JavaScript (zero dependencies)

## Learnings
- **Architecture:** Single `index.html` at repo root with inline `<style>` and `<script>`. IIFE wraps all JS. Game state, rendering, and input are cleanly separated sections within the script.
- **Canvas rendering:** Uses `<canvas>` for main board (300×600 at 30px cells) and a separate smaller canvas for next-piece preview.
- **Game loop:** `requestAnimationFrame`-based loop. Gravity uses timestamp delta vs `dropInterval`. Lock delay (500ms) prevents instant locks when piece lands.
- **Piece system:** 7-bag randomizer for fair piece distribution. Shapes stored as arrays of [row,col] offsets per rotation state. Basic wall kicks (try ±1, ±2 column offsets).
- **Controls:** Arrow keys for move/rotate (Up=CW, Down=CCW), Shift=soft drop, P/Escape=pause. `e.preventDefault()` blocks browser scroll.
- **Scoring:** 1-line=100, 2=300, 3=500, 4=800 multiplied by level. Level increments every 10 lines. Speed increases by 60ms per level down to 80ms floor.
- **Line clear animation:** 300ms flash effect using sin-wave white/color toggle before rows are actually removed.
- **Ghost piece:** Rendered at drop target with 25% alpha fill and 50% alpha border.
- **Key file:** `/index.html` — the entire game in one file (~630 lines).
