# 🍂 Emoji Memory Game

A seasonal take on the classic [Concentration](https://en.wikipedia.org/wiki/Concentration_(card_game)) card game, built with React, TypeScript and Tailwind CSS.

Flip the cards, find all the emoji pairs and beat the clock! The game dresses up for the time of the year:
spring, summer, autumn and winter, plus Christmas, Halloween and Easter editions.

## How to play

1. Press **Start game** on the home screen.
2. Pick a difficulty:

   | Level     | Board | Pairs |
   |-----------|-------|-------|
   | Easy      | 4 × 4 | 8     |
   | Medium    | 4 × 6 | 12    |
   | Difficult | 5 × 6 | 15    |

3. Tap a card to turn it over, then tap a second one. Every card shines like a holographic trading card when
   its front shows up (sweep, rays, prism, ring or glitter: both cards of a pair share the same effect).
   - If they match, they bounce with a gold ring and stay face up.
   - If not, they shake sideways with a red flash and flip back after a short delay.
4. Reveal every pair before the **60-second** countdown runs out to win.

The game panel shows:

- ⏱️ **Time counter**: the countdown.
- 🔁 **Move counter**: goes up by one each time two cards are turned over, whether they match or not.
- 🧩 **Remaining pairs**: pairs still to be found.
- Buttons to **start again**, **show the solution**, or **go back** to level selection.

The board switches between landscape and portrait layouts to fit the screen.

## Seasonal themes

The theme is picked automatically from today's date. Holidays take precedence over seasons:

| Theme        | Dates                                                   | Stamp on the home screen |
|--------------|---------------------------------------------------------|--------------------------|
| 🎄 Christmas | 1 December – 6 January                                  | 🎄 Christmas Edition     |
| 🎃 Halloween | 15 October – 1 November                                 | 🎃 Halloween Edition     |
| 🐣 Easter    | Palm Sunday – Easter Monday (computed every year)       | 🐣 Easter Edition        |
| 🌸 Spring    | 20 March – 20 June                                      | –                        |
| ☀️ Summer    | 21 June – 21 September                                  | –                        |
| 🍂 Autumn    | 22 September – 30 November                              | –                        |
| ❄️ Winter    | 7 January – 19 March                                    | –                        |

Season dates are for the northern hemisphere. The hemisphere is detected from the browser time zone
(e.g. `Australia/Sydney`, `America/Sao_Paulo`), and southern players get the opposite seasons. Holidays keep their dates.
While the game is open, the date is checked again every minute, so the theme changes by itself when a new period starts.

Each theme comes with:

- **An animated vector background**: snow falling in several depth layers, leaves and petals tumbling, windows
  switching on and off, chasing Christmas lights, bats, a floating ghost, a turning windmill, rolling waves...
- **Its own colours** for titles, buttons, cards and modals.
- **Its own emoji deck** for the cards, and its icon on the back of the cards.
- **Its icon in the tab title and favicon.**
- **An "Edition" stamp** on the home screen, with the holiday emoji (holidays only).

The round buttons in the bottom-right corner let players:

- ⏸️ **pause or resume the background animation**. It starts paused when the system asks for reduced motion,
  or on low-end devices (see below).
- 🎨 **pick any theme**, or go back to **Automatic**. The choice is remembered in `localStorage`.

URL parameters, handy to preview or share a theme:

| Parameter              | Effect                                                     |
|------------------------|------------------------------------------------------------|
| `?theme=halloween`     | Selects a theme (`auto` goes back to the calendar)          |
| `?date=2026-10-31`     | Pretends today is another day (for the automatic theme)     |
| `?hemisphere=south`    | Overrides the hemisphere detected from the time zone        |
| `?performance=low`     | Behaves as on a low-end device (static background)          |
| `?performance=high`    | Disables the low-end device detection                       |

### Low-end devices

On low-end devices, the background stays displayed but becomes **static**: its animations are frozen on a
complete frame of the scene, and themes switch without cross-fade or colour blending. A device is considered low-end when:

- the browser reports **2 GB of memory or less** (`navigator.deviceMemory`) or **2 CPU cores or fewer**
  (`navigator.hardwareConcurrency`), or the user turned on a **data saver**. These hints are read at start-up, but
  not every browser exposes them (Safari and Firefox do not give the memory, for instance);
- or, on any browser, the animated scene runs at **less than 40 frames per second**. Each theme is measured once per
  visit, for 3 seconds after a short warm-up, only while the tab is visible. This also catches battery-saver modes that
  cap the frame rate. The result is remembered for 7 days, so the next visits start static right away.

The player can still press ▶️ to play the animation: their choice always wins. Thresholds are in
[`src/utils/device.utils.ts`](src/utils/device.utils.ts). The result is also exposed as
`<html data-performance="low|normal">` for stylesheets.

Card flips, bounces and shakes are kept on every device: they are short transforms handled by the GPU, and they
are part of the gameplay feedback. The holographic shine is reduced to a plain light sweep (colour blending is costly).
With the system "reduce motion" setting, cards do not move: the gold / red rings tell whether a pair matches.

## Performance

The animated backgrounds run hundreds of CSS animations. They stay smooth because the browser runs
them on its compositor thread, away from the main thread (where React, clicks and card flips happen).
A few rules keep it that way, and breaking any of them made card flips stutter now and then:

- **No `animationiteration` listener.** React listens to every event type on its root element, and a
  single `animationiteration` listener in the page makes the browser report each loop of each animation
  to the main thread. `src/utils/dom.utils.ts` filters that listener out (`main.tsx`); do not use
  `onAnimationIteration` in the app.
- **Keyframes only animate `transform` and `opacity`,** and **contain no CSS variables** (variables inside
  keyframes are re-resolved for every element each time the main thread draws a frame). Amounts are
  picked with variant classes instead (e.g. `.sway--medium`, `.drift--long`, `.particle-motion--tumble-2`).
  `src/animations.performance.test.ts` checks every stylesheet.
- **Few animations per element type:** particles use one animation each, stars twinkle in groups and
  Christmas bulbs blink by chase phase.
- **Cards:** the flip is a CSS transition on `data-state`; cards are memoized so a click only re-renders
  the cards that change. After a wrong pair, the board stays playable: clicking another card turns the pair back at once.

Measure with a production build (`pnpm build && pnpm preview`): the development build adds React's extra checks.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for development and builds
- [React Router](https://reactrouter.com/) for navigation
- [Tailwind CSS 4](https://tailwindcss.com/) for styling, through its Vite plugin (no PostCSS / Autoprefixer).
  It is configured in CSS, in [`src/index.css`](src/index.css) (`@import "tailwindcss"` and `@theme`): there is no
  `tailwind.config` file. Only the colours defined there exist (Tailwind's default palette is disabled).
- [Zustand](https://zustand.docs.pmnd.rs/) for the theme settings (persisted in `localStorage`)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for tests
- [Storybook](https://storybook.js.org/) for building and documenting components

## Getting started

Requirements: [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (required by Vite 8) and [pnpm](https://pnpm.io/).

Supported browsers: Safari 16.4+, Chrome 111+ and Firefox 128+ (the baseline of Tailwind CSS 4). Older browsers
are not supported, but the CSS degrades gracefully in those that understand cascade layers (Safari 15.4+,
Chrome 99+, Firefox 97+): Tailwind's output and the card styles include fallbacks (plain colours where `color-mix()`
is missing, default values for Tailwind's `@property` variables). Browsers without cascade layers get no Tailwind styles.

Note: `package.json` overrides `bcp-47` to 2.1.1 (`pnpm.overrides`): jsdom 31 asks for `^2.1.2`, which has never been
published. Remove the override once a newer version of one of them is available.

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
│   ├── backgrounds/    # One animated SVG scene per theme (+ shared shapes, particles and animations)
│   ├── containers/     # Components with state and logic (Home, DifficultyLevelSelector, Game, ThemedBackground, ThemeControls)
│   ├── presentational/ # Game-specific components that only render props (Card, GamePanel, TimeCounter, ...)
│   └── ui/             # Generic, reusable building blocks (Button, Modal)
├── configuration/      # Game settings (levels, time limit, flip-back delay) and themes (emojis, colours)
├── hooks/              # Custom hooks (useScreenOrientation, useActiveTheme, useThemeSync, ...)
├── models/             # TypeScript interfaces
├── store/              # Zustand stores: theme settings, device performance
├── stories/            # Storybook stories (atoms, molecules, organisms, pages, themes, scenery = background building blocks)
└── utils/              # Helpers (arrays, dates and Easter, theme selection, colours, device detection)
```

## Configuration

Game settings live in [`src/configuration/game.configuration.ts`](src/configuration/game.configuration.ts):

- `levels`: each level's name and board size.
- `gameConfiguration.timeLimit`: game duration, in seconds.
- `gameConfiguration.flipBackTime`: how long mismatched cards stay visible, in milliseconds.

To add a difficulty, add an entry to `levels`.

Themes live in [`src/configuration/themes.configuration.ts`](src/configuration/themes.configuration.ts):

- `emojis`: the set of emojis cards are drawn from (it needs at least as many emojis as the largest level has pairs).
- `colors`: the application colours (hex). They replace the Tailwind theme variables (`--color-primary`, ...) at
  runtime, so Tailwind classes such as `text-primary` or `bg-quaternary/15` follow the active theme. Their default
  values are in the `@theme static` block of `src/index.css`.
- `icon`, `name` and `kind` (`season` or `holiday`; only holidays show the stamp).

The dates are in [`src/utils/theme.utils.ts`](src/utils/theme.utils.ts).

### Customising the backgrounds

Each background is an inline SVG component in `src/components/backgrounds/<Theme>Background/`, with a stylesheet next to it.
Every part of the scene has an id prefixed with the theme (`#christmas-sky`, `#christmas-moon`, `#christmas-village`,
`#christmas-tree-lights`, `#autumn-cabin`, `#autumn-falling-leaves`...), so it can be restyled from CSS. Each stylesheet
starts with the scene's variables (sky colours, window light, bulb colours, blink speed...):

```css
#christmas-background {
  --window-on: #FFD27A;      /* light of the windows */
  --bulb-red: #FF5A5F;       /* Christmas light colours */
  --light-cycle: 2.8s;       /* duration of one blink */
  --light-chase-step: 0.3s;  /* delay between neighbour bulbs */
}
```

Shared animations (falling/rising particles, twinkling, windows switching on and off, swaying, drifting clouds,
chimney smoke, flying creatures...) are in `src/components/backgrounds/shared/background.css`. Only `transform` and
`opacity` are animated, and the pause button freezes everything with `animation-play-state`.

To preview the scenes, open **Themes/Backgrounds** in Storybook, or use the **Theme** menu of the Storybook toolbar
to see any component in any theme. The building blocks of the scenes (trees, clouds, windows, Christmas lights,
particles, flying birds...) each have their own story under **Scenery**, with controls to try their options.

## License

[MIT](LICENSE)
