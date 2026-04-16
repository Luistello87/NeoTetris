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

---

### Decision: Multiplayer Architecture and PRD

**Author:** Flynn (Lead) — assembled from team inputs  
**Contributors:** Tron (Game Dev), Quorra (Frontend Dev), Rinzler (QA/Testing)  
**Date:** 2026-04-16  
**Status:** PRD Filed as GitHub Issue #1

#### Overview

NeoTetris transitions from single-player to competitive multiplayer with real-time 1v1 battles, garbage line attack mechanics, Glicko-2 ranking, private rooms, spectator mode, and social features. Architecture uses WebSocket for server-authoritative match state and hybrid client-local physics for zero input lag. Phases: (1) foundational server + 1v1 mode, (2) competitive features, (3) social systems, (4) large-scale modes.

#### Game Mechanics (Tron)

- **Attack table:** Single/Double/Triple/Tetris/T-Spins send 0/1/2/4/2-6 garbage lines respectively, with +1 for back-to-back and +1 per combo step
- **Garbage queue and cancel:** Incoming garbage queues in visible meter; defending player's line clears within 500ms grace window cancel outgoing garbage
- **Piece seed:** Both players share identical 7-bag sequence (Glicko-2 fairness)
- **Client-authoritative local board:** No server simulation of Tetris physics; inputs never delayed
- **Server-authoritative garbage routing:** Server validates all moves, relays garbage events, manages match state

#### Technical Architecture

**Real-time synchronization:**
- Input events: Client → Server every ~16ms
- Garbage events: Server → Client on line clear
- Board state snapshot: Client → Server every lock (~1/sec)
- Game over signal: Client → Server once
- Opponent board render: Server → Client at 4–10 Hz throttled

**Communication protocol:** WebSocket (via Socket.IO or native WS)
- Rationale: Server authority (cheat mitigation), trivial spectator fan-out, O(N) scaling, simpler NAT traversal vs. WebRTC
- Acceptable latency: 150ms for garbage delivery (queue + cancel absorbs jitter)

**Hybrid authority:**
- Client owns: piece movement, rotation, gravity, lock delay, rendering
- Server owns: garbage routing, garbage cancellation, match start/end, piece seed distribution, board validation, anti-cheat sampling

**Tick parameters:**
- Client game loop: 60 FPS (existing RAF)
- Client → Server heartbeat: 100ms (batched inputs + board hash)
- Server → Client board sync: 250ms (cosmetic, not gameplay)
- Server tick (match logic): 20 Hz (garbage resolution, anti-cheat)
- Reconnect grace: 15 seconds

**Reconnection handling:**
1. Disconnect detected → client exponential backoff (1s, 2s, 4s, 8s, max 15s)
2. Server pauses match, shows "Waiting for player..." overlay with 15s countdown
3. Reconnect sends current board state; server validates against last known + elapsed
4. If valid: resume + replay queued garbage; if timeout: forfeit (soft rating penalty)
5. Auth: matchToken (JWT) stored in sessionStorage for fast re-entry

#### Database Schema

**`players`** — Profiles, lifetime stats, auth
**`player_ratings`** — Glicko-2 ratings per mode
**`matches`** — Match metadata (mode, players, winner, piece seed, config)
**`match_players`** — Per-player match stats (finish position, score, garbage sent/received, T-spins, tetrises, peak combo)
**`match_replays`** — Compressed input logs for deterministic replay (seed + inputs = identical outcome)
**`daily_scores`** — Leaderboard aggregation by date
**`sprint_records`** — 40-line sprint times
**`private_rooms`** — Room state, 30-min inactivity cleanup

**Rating system:** Glicko-2 (initial 1500 ± 350 RD, ±200 matching window expanding 50 per 10s queue time, min 10 placement matches)

#### UI/UX (Quorra)

**1v1 Battle Mode:**
- Your board at full size (300×600, CELL=30)
- Opponent board at 75% scale (220×440, CELL=22, desaturated 0.85 opacity)
- VS HUD center: live scores, garbage queue indicator (magenta→cyan gradient), match timer, room code badge
- Attack toast: "ATTACK ×2" flash above opponent when you clear 2+
- Pending garbage: red-highlighted column on receiving player's left edge, counting down

**Spectator View:**
- Both boards equal 65% scale side-by-side
- Centered VS divider with live stats ticker
- Spectator count badge (👁 N watching)
- Game event feed: "Player_A cleared TETRIS!" in cyan, "Player_B sent 4 garbage!" in magenta
- Emote reactions (⚡🔥💀👏) float over boards as CSS animations

**Lobby / Room UI:**
- Quick Match: find opponent, queue counter
- Create Room: mode selector, auto-generated code, copy link
- Join Room: code input, join button
- Leaderboard: top-100 ratings

**Design:** Same neo-brutalist aesthetic — `#F5F0E8` cream, `#111` black, `Courier New` monospace, accents `#FFE500`/`#FF00FF`/`#00FFFF`/`#00FF00`/`#FF8800`

#### Testing Strategy (Rinzler)

**Critical edge cases:**
1. Player disconnection mid-match → reconnect recovery
2. Latency spikes (500ms+ lag) → client prediction + resync
3. Simultaneous line clears → server-tick atomicity, garbage order determinism
4. Race conditions in garbage delivery → append-only queue, transactional inserts
5. Both players top out simultaneously → first to top-out loses, deterministic tie-break by player_id
6. Tab backgrounding (RAF pauses) → resync on focus, skip queued garbage

**Test approach:** Multi-tab local testing, network throttling (tc/netem or DevTools), replay determinism (1000 random matches), load testing (100+ concurrent 1v1), database migration testing, auth flow (token expiry, refresh, multi-device)

**Anti-cheat:** Server validates all moves (legal piece placement, no time-traveling), rate limit (10 moves/sec), replay integrity (recalculate score from immutable log)

**Rate limiting:** Token bucket — 10 move/sec, 5 chat/sec, 1 garbage per 200ms, heartbeat 1 per 5s; >5 violations in 1 min → disconnect

**Auth token security:** No plaintext in logs/URLs, WSS only, JWT signature validation, token expiry + refresh, HttpOnly cookies

**SQL injection prevention:** Parameterized queries, ORM `.where()` not `.raw()`, whitelisted sort fields

#### Phases

**Phase 1 (Foundation):** Server setup, 1v1 match logic, WebSocket plumbing, database schema, anti-cheat basic, auth (JWT)

**Phase 2 (Competitive):** Glicko-2 ranking, ranked/casual queues, replay system, leaderboards, determinism testing

**Phase 3 (Social):** Friends lists, profiles, match invites, in-game chat/emotes, spectator mode

**Phase 4 (Scale):** Private rooms, UI polish, mobile touch, battle royale (stretch goal)

#### Non-Goals (v1)

- Battle royale (10–50 players)
- Voice chat (WebRTC)
- Mobile touch controls (designed but deferred)
- Tournament brackets
- Custom skins
- Native wrappers
- Monetization

#### Migration Path

Current `index.html` (IIFE, ~670 lines) refactors into:
1. **TetrisEngine class** — takes board state + piece seed, exposes `tick()`, `input()`, `getState()`
2. **Renderer class** — takes canvas + engine state (supports local + opponent mini-view)
3. **MatchClient class** — wraps WebSocket, handles garbage, feeds into engine
4. **Garbage system** — `receiveGarbage(lines, gapCol)` method modifying board array
5. **Seeded PRNG** — replace `Math.random()` with xorshift128 for identical piece sequences

These are **prerequisite refactors** before multiplayer code can be written. Existing game logic (collision, rotation, lock delay) is solid and reusable.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
