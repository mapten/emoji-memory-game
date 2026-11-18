import { Theme, ThemeId } from '../models/theme.model';

/**
 * All the themes of the game.
 * The active one is chosen from the current date (see `utils/theme.utils.ts`) unless the player picks one.
 * Each theme has its own background in `components/backgrounds/<Name>Background`.
 */
export const themes: Record<ThemeId, Theme> = {
  spring: {
    id: 'spring',
    name: 'Spring',
    kind: 'season',
    icon: '🌸',
    emojis: ['🌸', '🌷', '🌼', '🌻', '🌱', '🌿', '🍀', '🐝', '🦋', '🐞', '🐛', '🐌',
      '🐸', '🐤', '🪺', '🌈', '☔', '🌦️', '🪴', '🐑', '🌺', '🍓', '🐦', '🪁'],
    colors: {
      primary: '#2E6B3F',
      secondary: '#E0527E',
      tertiary: '#FFC2D4',
      quaternary: '#3A9A5B',
      quinary: '#8ECAE6',
      stamp: '#E0527E',
    },
  },
  summer: {
    id: 'summer',
    name: 'Summer',
    kind: 'season',
    icon: '☀️',
    emojis: ['☀️', '🏖️', '🌊', '🏄', '🍉', '🍦', '🍹', '🕶️', '👙', '🩴', '🐚', '🦀',
      '🐠', '🐬', '🌴', '⛱️', '🍍', '🥥', '🚤', '⛵', '🏝️', '🦩', '🍧', '🤿'],
    colors: {
      primary: '#0B5E7E',
      secondary: '#F25F4C',
      tertiary: '#FFD166',
      quaternary: '#0E9AA7',
      quinary: '#F7B267',
      stamp: '#F25F4C',
    },
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn',
    kind: 'season',
    icon: '🍂',
    emojis: ['🍁', '🍂', '🍄', '🌰', '🦔', '🐿️', '🍎', '🍐', '🍇', '🌾', '🥧', '☕',
      '🧣', '🦉', '🌽', '🍠', '🦃', '🪵', '🌧️', '☂️', '🧥', '🥾', '🍯', '🦊'],
    colors: {
      primary: '#8C2F14',
      secondary: '#C2414C',
      tertiary: '#F2B134',
      quaternary: '#D9532B',
      quinary: '#6A994E',
      stamp: '#C2414C',
    },
  },
  winter: {
    id: 'winter',
    name: 'Winter',
    kind: 'season',
    icon: '❄️',
    emojis: ['❄️', '☃️', '⛄', '🌨️', '⛷️', '🏂', '⛸️', '🧤', '🧣', '🎿', '🏔️', '🐧',
      '🐻‍❄️', '🦭', '🫖', '☕', '🍲', '🔥', '🧊', '🛷', '🥶', '🌬️', '🧦', '🐺'],
    colors: {
      primary: '#3D4F8C',
      secondary: '#7A6BC8',
      tertiary: '#DDE6FF',
      quaternary: '#4A8FD9',
      quinary: '#A8DADC',
      stamp: '#3D4F8C',
    },
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas',
    kind: 'holiday',
    icon: '🎄',
    emojis: ['🎅', '🎄', '❄️', '🎁', '🥂', '🌠', '☃️', '⛄',
      '🫎', '🌨️', '🤶', '🧑‍🎄', '🎉', '💫', '🧦', '🥛',
      '🧝‍♀️', '🌟', '🍪', '🦌', '🕯️', '👼', '🥳', '🎊'],
    colors: {
      primary: '#A4161A',
      secondary: '#0F5257',
      tertiary: '#F4C542',
      quaternary: '#1F7A4D',
      quinary: '#E9ECEF',
      stamp: '#C81D25',
    },
  },
  halloween: {
    id: 'halloween',
    name: 'Halloween',
    kind: 'holiday',
    icon: '🎃',
    emojis: ['🎃', '👻', '🦇', '🕷️', '🕸️', '🧙‍♀️', '🧛', '🧟', '💀', '☠️', '🍬', '🍭',
      '🐈‍⬛', '🌕', '🔮', '🪦', '🧹', '🕯️', '🦉', '🐺', '👽', '🤡', '🧪', '🪄'],
    colors: {
      primary: '#4B1D6B',
      secondary: '#7B2CBF',
      tertiary: '#FFB627',
      quaternary: '#E8630A',
      quinary: '#9BE564',
      stamp: '#E8630A',
    },
  },
  easter: {
    id: 'easter',
    name: 'Easter',
    kind: 'holiday',
    icon: '🐣',
    emojis: ['🐰', '🐇', '🥚', '🐣', '🐥', '🐤', '🌷', '🌼', '🧺', '🍫', '🐑', '🌸',
      '🦋', '🪺', '🐔', '🥕', '🎀', '⛪', '🕊️', '🌱', '🍞', '🧁', '🎨', '🌈'],
    colors: {
      primary: '#6B4FA0',
      secondary: '#E56B9F',
      tertiary: '#FFF1A8',
      quaternary: '#3E9E86',
      quinary: '#A0D8F1',
      stamp: '#8E5CC6',
    },
  },
};

/** Order in which the themes are listed in the theme selector. */
export const themeOrder: ThemeId[] = ['spring', 'summer', 'autumn', 'winter', 'christmas', 'halloween', 'easter'];

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === 'string' && value in themes;
