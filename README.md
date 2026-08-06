# Word Connect Learning Game

I built this React game around a familiar word-connect interaction: players select letters from a circular board to form target words and fill the puzzle grid. The project also includes a teacher-facing editor for preparing custom learning levels.

## Features

- Mouse and touch input for selecting connected letters.
- Automatic validation against the target word list.
- Generated puzzle grids based on level data.
- Hint and letter-shuffle controls.
- Animated feedback for correct and incorrect attempts.
- Responsive layout for phones, tablets and desktop browsers.
- A teacher panel for creating, previewing, importing and exporting level data.

## Technology

- React 19 and Vite
- JavaScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

A production build can be generated with `npm run build`.

## Design approach

The game state, puzzle data and visual components are kept separate so that levels can be changed without rewriting the interaction logic. Framer Motion handles transitions and gesture feedback, while the responsive layout allows the same game flow to work across touch and pointer devices.
