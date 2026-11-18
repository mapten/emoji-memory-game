import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

// Components
import { Card } from '../../components/presentational/Card/Card';
import { getHoloVariant, HOLO_VARIANTS } from '../../components/presentational/Card/holo';

// One emoji per holographic effect, to show them all.
const EMOJI_POOL = ['🦄', '🎃', '🌸', '❄️', '🎁', '🐣', '🍂', '☀️', '🌟', '🍪', '🦌', '🧦', '🎉', '💫', '👼'];
const emojiPerVariant = HOLO_VARIANTS.map((variant) => [variant, EMOJI_POOL.find((emoji) => getHoloVariant(emoji) === variant) ?? '🦄']);

const meta = {
  title: 'Atoms/Card',
  component: Card,
  decorators: [(story) => <div className="min-h-48 min-w-48">{story()}</div>],
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    emoji: '🦄',
    disabled: false,
    onClick: fn(),
  },
} satisfies Story;

export const ResetCards = {
  render: () => {
    const [cardLeftShowBack, setCardLeftShowBack] = useState(false);
    const [cardRightShowBack, setCardRightShowBack] = useState(false);

    const handleReset = () => {
      setCardLeftShowBack(true);
      setCardRightShowBack(true);
    };

    return (<div>
      <button className="bg-gray-400 rounded-md p-2 mb-4" onClick={handleReset}>Reset cards</button>
      <div className="flex gap-2">
        <Card initialShowBack={cardLeftShowBack} onClick={() => {}} emoji="🦄" />
        <Card initialShowBack={cardRightShowBack} onClick={() => {}} emoji="🎅" />
      </div>
    </div>);
  }
};

/** Click a card to turn it over: the holographic shine plays every time its front shows up. */
export const HoloEffects = {
  render: () => (
    <div className="flex gap-6 flex-wrap">
      {emojiPerVariant.map(([variant, emoji]) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Card emoji={emoji} backIcon="🎴" initialShowBack={false} onClick={() => {}} />
          <span className="text-sm">{variant}</span>
        </div>
      ))}
    </div>
  ),
};

/** Pair found: the cards bounce, a gold ring pulses, and they keep a soft glow. */
export const Matched = {
  args: { emoji: '🦄', initialShowBack: false, disabled: true, feedback: 'match', onClick: fn() },
} satisfies Story;

/** Wrong pair: the cards shake sideways with a red flash (before turning back). */
export const Mismatched = {
  args: { emoji: '🦄', initialShowBack: false, disabled: true, feedback: 'mismatch', onClick: fn() },
} satisfies Story;

export default meta;
