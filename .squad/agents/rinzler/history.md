# Rinzler — History

## Project Context
- **Project:** NeoTetris — Tetris game in pure HTML/CSS/JS, neo-brutalist design
- **User:** Brady
- **Stack:** HTML, CSS, JavaScript (zero dependencies)

## Learnings

### Code Audit — Full Requirements Check (Session 1)

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1 | All 7 tetrominos (I,O,T,S,Z,J,L) | ✅ PASS | All present in SHAPES with 4 rotation states each |
| 2 | Grid 10×20 | ✅ PASS | COLS=10, ROWS=20 |
| 3 | Controls match spec | ✅ PASS | Left/Right=move, Up=CW, Down=CCW, Shift=soft drop, P/Esc=pause |
| 4 | Rotation directions correct | 🐛 **BUG FIXED** | T-piece states 1 and 3 were swapped (CCW order instead of CW). All other pieces verified correct. Fixed by providing correct CW rotation offsets. |
| 5 | Collision detection | ✅ PASS | `isValid()` checks bounds and board occupancy correctly |
| 6 | Line clearing | ✅ PASS | Full rows detected, splice+unshift maintains correct indices |
| 7 | Scoring (100/300/500/800) | ✅ PASS | LINE_POINTS=[0,100,300,500,800], multiplied by level (standard enhancement) |
| 8 | Level/speed every 10 lines | ✅ PASS | `level = floor(totalLines/10)+1`, interval decreases by 60ms/level |
| 9 | Game over detection | ✅ PASS | Checked on spawn via `isValid()` |
| 10 | Ghost piece | ✅ PASS | `ghostRow()` drops piece to lowest valid position, rendered with transparency |
| 11 | Next piece preview | ✅ PASS | Rendered centered on separate canvas |
| 12 | Wall kicks | ✅ PASS | Tries offsets [0, -1, 1, -2, 2] on rotation |

**Bug detail:** T-piece CW rotation went down→right→up→left (CCW). Fixed to down→left→up→right (CW), matching all other pieces. Verified by computing `new_row=col, new_col=maxRow-row` transformation for each state transition.
