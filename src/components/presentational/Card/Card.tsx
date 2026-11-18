import { CSSProperties, memo, useEffect, useState } from 'react';

// Styles
import './Card.css';
// Effects
import { getHoloVariant, GLITTER_STARS } from './holo';

/** Feedback played once both cards of a move are face up. */
export type CardFeedback = 'match' | 'mismatch';

type Props = {
  // The emoji to be displayed on the front of the card.
  emoji: string;
  // Optional decoration of the card back (the theme icon).
  backIcon?: string;
  initialShowBack?: boolean;
  disabled?: boolean;
  // Pair found (the card bounces, then keeps a soft glow) or wrong pair (the card shakes sideways).
  feedback?: CardFeedback | null;
  onClick: () => void;
}

/**
 * A memory card. Its back shows the theme icon; its front shows the emoji and plays a holographic
 * shine (one of several shapes, see holo.ts) every time it is turned face up.
 *
 * The flip is a plain CSS transition driven by the `data-state` attribute (see Card.css), so it starts
 * in the same frame as the click, without waiting for JavaScript. The component is memoized: when one
 * card changes, the others are not re-rendered (the parent passes stable `onClick` callbacks).
 */
export const Card = memo(({emoji, backIcon, initialShowBack = true, disabled, feedback = null, onClick}: Props) => {
  const [showBack, setShowBack] = useState(true);
  const holoVariant = getHoloVariant(emoji);

  useEffect(() => {
    setShowBack(initialShowBack);
  }, [initialShowBack]);

  const handleCardClick = () => {
    if (disabled) return;
    setShowBack((showBack) => !showBack);
    onClick();
  };

  return(
    <div
      data-testid="card"
      data-feedback={feedback ?? undefined}
      className={'card-wrapper' + (disabled ? '' : ' is-playable') + (feedback ? ` card--${feedback}` : '')}
    >
      <button data-state={showBack ? 'back' : 'front'} disabled={disabled} className={'card relative select-none rounded-xl ' +
          'h-14 md:h-20 lg:h-24 xl:h-32 ' +
          'w-14 md:w-20 lg:w-24 xl:w-32'}
      onClick={handleCardClick}>
        <div className={'back absolute w-full h-full top-0 flex items-center justify-center bg-tertiary border-primary ' +
            'border-[3px] md:border-4 lg:border-[5px] rounded-lg md:rounded-xl'}
        >
          <div className="card-back-pattern" aria-hidden="true" />
          {backIcon && (
            <div className="card-back-emblem">
              <span data-testid="card-back-icon" aria-hidden="true" className="text-lg md:text-3xl lg:text-4xl xl:text-5xl">{backIcon}</span>
            </div>
          )}
        </div>
        <div className={'front w-full h-full top-0 absolute rounded-lg md:rounded-xl ' +
            'text-3xl md:text-5xl lg:text-6xl xl:text-7xl'}
        >
          <div className="card-front-frame" aria-hidden="true" />
          <span className="card-emoji relative leading-none">{emoji}</span>
          <div data-testid="card-holo" data-variant={holoVariant} className={`holo holo--${holoVariant}`} aria-hidden="true">
            <span className="holo-glare" />
            {holoVariant === 'glitter' && GLITTER_STARS.map(([top, left, size, delay], index) => (
              <span
                key={index}
                className="holo-star"
                style={{ top: `${top}%`, left: `${left}%`, width: `${size}%`, animationDelay: `${0.15 + delay}s` } as CSSProperties}
              />
            ))}
          </div>
        </div>
      </button>
    </div>
  );
});
Card.displayName = 'Card';
