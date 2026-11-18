import { GlowGradient } from '../../components/backgrounds/shared/shapes';
import { SceneFrameOptions } from './SceneFrame';

// The bulb colours and the chasing animation come from the Christmas stylesheet (scoped to #christmas-background).
import '../../components/backgrounds/ChristmasBackground/ChristmasBackground.css';

export const BULB_COLORS = ['red', 'gold', 'green', 'blue'];
const BULB_HEX: Record<string, string> = { red: '#FF5A5F', gold: '#FFD166', green: '#5DD39E', blue: '#5BC0EB' };

/** A night scene styled like the Christmas background, with the glow gradients of the bulbs. */
export const christmasNight: SceneFrameOptions = {
  id: 'christmas-background',
  background: '#1E2F5E',
  renderDefs: () => BULB_COLORS.map((color) => <GlowGradient key={color} id={`story-glow-${color}`} color={BULB_HEX[color]} />),
};
