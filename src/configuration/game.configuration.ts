import { Level } from '../models/level.model';

// The emojis of the cards depend on the active theme: see themes.configuration.ts.

export const levels: Level[] = [{
  name: 'easy',
  verticalCards: 4,
  horizontalCards: 4,
}, {
  name: 'medium',
  verticalCards: 6,
  horizontalCards: 4,
}, {
  name: 'difficult',
  verticalCards: 6,
  horizontalCards: 5,
}];

export const gameConfiguration = {
  timeLimit: 60, // the duration of the game in seconds
  flipBackTime: 900, // the time before the cards are flipped back when they are not the same, in milliseconds (leaves time for the "wrong pair" shake)
};