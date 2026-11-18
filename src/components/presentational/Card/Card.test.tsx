import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { render, fireEvent, screen } from '@testing-library/react';

// Components
import { Card } from './Card';
import { getHoloVariant } from './holo';

describe('Card', () => {
  it('should flip when clicked', () => {
    // arrange
    render(<Card emoji="😀" onClick={vi.fn()} />);

    // act
    fireEvent.click(screen.getByRole('button'));

    // assert
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'front');

    // act
    fireEvent.click(screen.getByRole('button'));

    // assert
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'back');
  });

  it('should not flip state when disabled', () => {
    // arrange
    render(<Card emoji="😀" disabled={true} onClick={vi.fn()} />);

    // act
    fireEvent.click(screen.getByRole('button'));

    // assert
    expect(screen.getByRole('button')).toHaveAttribute('disabled');
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'back');
  });

  it('should decorate the back of the card with the theme icon', () => {
    render(<Card emoji="😀" backIcon="🎃" onClick={vi.fn()} />);

    expect(screen.getByTestId('card-back-icon')).toHaveTextContent('🎃');
  });

  it('should not render a back icon when none is given', () => {
    render(<Card emoji="😀" onClick={vi.fn()} />);

    expect(screen.queryByTestId('card-back-icon')).not.toBeInTheDocument();
  });

  it('should not display any text on the back of the card', () => {
    render(<Card emoji="😀" backIcon="🎃" onClick={vi.fn()} />);

    expect(screen.queryByText(/memory/i)).not.toBeInTheDocument();
  });

  it('should prepare a holographic shine on the front, chosen from the emoji', () => {
    render(<Card emoji="🦄" onClick={vi.fn()} />);

    const holo = screen.getByTestId('card-holo');
    expect(holo).toHaveAttribute('data-variant', getHoloVariant('🦄'));
    expect(holo).toHaveClass(`holo--${getHoloVariant('🦄')}`);
  });

  it.each(['match', 'mismatch'] as const)('should play the %s feedback', (feedback) => {
    render(<Card emoji="😀" feedback={feedback} onClick={vi.fn()} />);

    expect(screen.getByTestId('card')).toHaveClass(`card--${feedback}`);
    expect(screen.getByTestId('card')).toHaveAttribute('data-feedback', feedback);
  });

  it('should not play any feedback by default', () => {
    render(<Card emoji="😀" onClick={vi.fn()} />);

    expect(screen.getByTestId('card')).not.toHaveAttribute('data-feedback');
  });
});
