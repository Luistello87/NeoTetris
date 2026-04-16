# Squad Decisions

## Active Decisions

### Decision: Game Architecture — Single File Canvas-Based Tetris

**Author:** Tron (Game Dev)
**Date:** 2025-07-17

#### Context
Brady requested a complete, playable Tetris game as a single `index.html` with zero dependencies.

#### Decision
- **Single `index.html`** with inline CSS and JS (IIFE-wrapped). No build step, no modules, no external assets.
- **Canvas rendering** for the game board (10×20 grid, 30px cells) and next-piece preview.
- **`requestAnimationFrame` game loop** with timestamp-based gravity and lock delay.
- **7-bag randomizer** for piece distribution (standard Tetris fairness).
- **Controls:** Arrow keys (move/rotate), Shift (soft drop), P/Escape (pause). Down arrow = counter-clockwise rotation per Brady's spec.
- **Neo-brutalist styling** via inline `<style>`: thick borders, hard box shadows, high-contrast neon palette, monospace type, cream background.

#### Rationale
Single-file approach enables instant demo — just open in browser. Canvas gives pixel-perfect control over game rendering while keeping DOM simple. IIFE prevents global scope pollution.

#### Impact
Any future features (hard drop, hold piece, sound, mobile touch controls) should be added within the same IIFE structure in `index.html`.

---

### Bug Fix: T-Piece Rotation States Swapped

**Filed by:** Rinzler (Tester)
**File:** `index.html`
**Severity:** Gameplay — rotation direction wrong for 1 of 7 pieces

#### Problem

The T-piece's rotation states 1 and 3 were defined in counterclockwise order, while all other 6 pieces (I, O, S, Z, J, L) used clockwise order. Since `rotatePiece(1)` (Up arrow = clockwise) advances through states 0→1→2→3, the T-piece was rotating the wrong direction compared to every other piece.

**Before fix:**
- State 0: bump down ✓
- State 1: bump RIGHT (should be LEFT for CW)
- State 2: bump up ✓
- State 3: bump LEFT (should be RIGHT for 270° CW)

#### Fix Applied

Replaced T-piece states 1 and 3 with correct CW rotation offsets:

```
// Before (states 1 & 3 swapped):
T: [..., [[0,0],[1,0],[2,0],[1,1]], ..., [[0,0],[1,0],[2,0],[1,-1]]]

// After (correct CW order):
T: [..., [[0,1],[1,0],[1,1],[2,1]], ..., [[0,0],[1,0],[1,1],[2,0]]]
```

#### Verification

Confirmed by applying the clockwise rotation formula (`new_row = col, new_col = maxRow - row`) to each T-piece state and verifying the result matches the next state. Also verified all 6 other pieces already follow correct CW progression.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
