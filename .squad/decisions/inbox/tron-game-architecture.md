# Decision: Game Architecture — Single File Canvas-Based Tetris

**Author:** Tron (Game Dev)
**Date:** 2025-07-17

## Context
Brady requested a complete, playable Tetris game as a single `index.html` with zero dependencies.

## Decision
- **Single `index.html`** with inline CSS and JS (IIFE-wrapped). No build step, no modules, no external assets.
- **Canvas rendering** for the game board (10×20 grid, 30px cells) and next-piece preview.
- **`requestAnimationFrame` game loop** with timestamp-based gravity and lock delay.
- **7-bag randomizer** for piece distribution (standard Tetris fairness).
- **Controls:** Arrow keys (move/rotate), Shift (soft drop), P/Escape (pause). Down arrow = counter-clockwise rotation per Brady's spec.
- **Neo-brutalist styling** via inline `<style>`: thick borders, hard box shadows, high-contrast neon palette, monospace type, cream background.

## Rationale
Single-file approach enables instant demo — just open in browser. Canvas gives pixel-perfect control over game rendering while keeping DOM simple. IIFE prevents global scope pollution.

## Impact
Any future features (hard drop, hold piece, sound, mobile touch controls) should be added within the same IIFE structure in `index.html`.
