# Yori — History

## Project Context
- **Project:** NeoTetris — Tetris game in pure HTML/CSS/JS, neo-brutalist design
- **User:** Brady
- **Stack:** Single index.html file, zero dependencies

## Learnings
- The entire game is a single IIFE in index.html (~670 lines). All state is module-scoped variables — no classes or external modules.
- Game uses 7-bag randomizer, 500ms lock delay, wall kicks with offsets [0,±1,±2], and a drop interval formula: max(80, 800-(level-1)×60)ms.
- Rendering is layered: grid → locked cells (with flash animation) → ghost piece → active piece → next preview on separate canvas.
- Mermaid `flowchart TD` with subgraphs works well for mapping single-file game architecture — keeps systems visually separated while showing cross-system flows.
- Created ARCHITECTURE.md with full workflow diagram covering game loop, state management, input, piece lifecycle, collision, rendering pipeline, and scoring.
