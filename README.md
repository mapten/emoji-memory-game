# 🎄 Emoji Memory Game

A Christmas-themed take on the classic [Concentration](https://en.wikipedia.org/wiki/Concentration_(card_game)) card game, built with React, TypeScript and Tailwind CSS.

Flip the cards, find all the emoji pairs and beat the clock!

## How to play

1. Press **Start game** on the home screen.
2. Pick a difficulty:

   | Level     | Board | Pairs |
   |-----------|-------|-------|
   | Easy      | 4 × 4 | 8     |
   | Medium    | 4 × 6 | 12    |
   | Difficult | 5 × 6 | 15    |

3. Tap a card to turn it over, then tap a second one.
   - If they match, they stay face up.
   - If not, they flip back after a short delay.
4. Reveal every pair before the **60-second** countdown runs out to win.

The game panel shows:

- ⏱️ **Time counter**: the countdown.
- 🔁 **Move counter**: goes up by one each time two cards are turned over, whether they match or not.
- 🧩 **Remaining pairs**: pairs still to be found.
- Buttons to **start again**, **show the solution**, or **go back** to level selection.

The board switches between landscape and portrait layouts to fit the screen.

## Tech stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for development and builds
- [React Router](https://reactrouter.com/) for navigation
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for tests
- [Storybook](https://storybook.js.org/) for building and documenting components

## Getting started

Requirements: [Node.js](https://nodejs.org/) 18+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

Then open the URL that Vite prints (by default http://localhost:5173).

## Scripts

| Command                | Description                               |
|------------------------|-------------------------------------------|
| `pnpm dev`             | Start the development server              |
| `pnpm build`           | Type-check and build for production       |
| `pnpm preview`         | Serve the production build locally        |
| `pnpm test`            | Run unit tests in watch mode              |
| `pnpm test --run`      | Run unit tests once                       |
| `pnpm lint`            | Lint the codebase with ESLint             |
| `pnpm storybook`       | Start Storybook on http://localhost:6006  |
| `pnpm build-storybook` | Build a static Storybook                  |

## Project structure

```
src/
├── components/
│   ├── containers/     # Screens with state and logic (Home, DifficultyLevelSelector, Game)
│   ├── presentational/ # Game-specific components that only render props (Card, GamePanel, TimeCounter, ...)
│   └── ui/             # Generic, reusable building blocks (Button, Modal)
├── configuration/      # Game settings: emojis, levels, time limit, flip-back delay
├── hooks/              # Custom hooks (useScreenOrientation)
├── models/             # TypeScript interfaces
├── stories/            # Storybook stories (atoms, molecules, organisms, pages)
└── utils/              # Helpers (array shuffling and sampling)
```

## Configuration

All game settings live in [`src/configuration/game.configuration.ts`](src/configuration/game.configuration.ts):

- `emojis`: the set of emojis cards are drawn from (it needs at least as many emojis as the largest level has pairs).
- `levels`: each level's name and board size.
- `gameConfiguration.timeLimit`: game duration, in seconds.
- `gameConfiguration.flipBackTime`: how long mismatched cards stay visible, in milliseconds.

To change the theme, swap the emoji list. To add a difficulty, add an entry to `levels`.

## Credits

- Originally built as a solution to the [MoureDev](https://www.twitch.tv/mouredev) × [Rviewer](https://rviewer.io) Memory Game challenge.
- Font: *Chiki*.

## License

[MIT](LICENSE) © mapten
