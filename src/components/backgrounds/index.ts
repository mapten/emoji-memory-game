import { ComponentType } from 'react';
import { ThemeId } from '../../models/theme.model';

import { AutumnBackground } from './AutumnBackground/AutumnBackground';
import { WinterBackground } from './WinterBackground/WinterBackground';
import { ChristmasBackground } from './ChristmasBackground/ChristmasBackground';
import { HalloweenBackground } from './HalloweenBackground/HalloweenBackground';
import { SpringBackground } from './SpringBackground/SpringBackground';
import { SummerBackground } from './SummerBackground/SummerBackground';
import { EasterBackground } from './EasterBackground/EasterBackground';

/** Background scene of every theme. */
export const backgrounds: Record<ThemeId, ComponentType> = {
  spring: SpringBackground,
  summer: SummerBackground,
  autumn: AutumnBackground,
  winter: WinterBackground,
  christmas: ChristmasBackground,
  halloween: HalloweenBackground,
  easter: EasterBackground,
};
