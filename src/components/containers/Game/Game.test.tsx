import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as arrayUtils from '../../../utils/array.utils';

import { render, fireEvent, screen, act, within } from '@testing-library/react';
import { Game } from './Game';
import { MemoryRouter } from 'react-router-dom';
import { useThemeStore } from '../../../store/theme.store';
import { themes } from '../../../configuration/themes.configuration';
import { gameConfiguration } from '../../../configuration/game.configuration';

describe('Game', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  const baseEmojis = ['🧝‍♀️', '🌟', '🍪', '🦌', '🕯️', '👼', '🥳', '🎊'];

  beforeEach(() => {
    useThemeStore.setState({ selection: 'auto', animationsPaused: null, autoThemeId: 'christmas' });
    vi.spyOn(arrayUtils, 'getRandomSubarray').mockReturnValue(baseEmojis);
    vi.spyOn(arrayUtils, 'shuffleArray').mockReturnValue([...baseEmojis, ...baseEmojis]);
  });

  const renderUI = () => render(<MemoryRouter initialEntries={['test?difficulty=easy']}>
    <Game />
  </MemoryRouter>);

  it('should decrease the number of left pairs when a pair is selected', () => {
    // arrange
    renderUI();

    // assert
    expect(screen.getByTestId('left-pairs')).toHaveTextContent('8');

    // act
    screen.getAllByText('🧝‍♀️').forEach(el => fireEvent.click(el));

    // assert
    expect(screen.getByTestId('left-pairs')).toHaveTextContent('7');
  });

  it('should increate the number of movements when a pair is selected', () => {
    // arrange
    renderUI();

    // assert
    expect(screen.getByTestId('move-counter')).toHaveTextContent('0');

    // act
    screen.getAllByText('🧝‍♀️').forEach(el => fireEvent.click(el)); // matching pairs

    // assert
    expect(screen.getByTestId('move-counter')).toHaveTextContent('1');

    // act
    fireEvent.click(screen.getAllByText('🌟')[0]); // non matching pairs
    fireEvent.click(screen.getAllByText('🍪')[0]);

    expect(screen.getByTestId('move-counter')).toHaveTextContent('2');
  });

  it('should display the modal game finished when all pairs are selected', () => {
    // arrange
    renderUI();

    expect(screen.queryByText('You won!🥳')).toBeNull();

    // act
    baseEmojis.forEach(emoji => screen.getAllByText(emoji).forEach(el => fireEvent.click(el)));

    // assert
    expect(screen.getByText('You won!🥳')).toBeInTheDocument();
  });

  it('should match the cards when two cards with the same emoji are flipped', () => {
    // arrange
    renderUI();

    // assert
    expect(screen.getAllByText('🧝‍♀️')[0].closest('button')).toHaveAttribute('data-state', 'back');
    expect(screen.getAllByText('🧝‍♀️')[1].closest('button')).toHaveAttribute('data-state', 'back');

    // act
    fireEvent.click(screen.getAllByText('🧝‍♀️')[0]);
    fireEvent.click(screen.getAllByText('🧝‍♀️')[1]);

    // assert
    expect(screen.getAllByText('🧝‍♀️')[0].closest('button')).toHaveAttribute('data-state', 'front');
    expect(screen.getAllByText('🧝‍♀️')[1].closest('button')).toHaveAttribute('data-state', 'front');
  });

  it('should flip the cards back if two cards with different emojis are flipped', () => {
    // arrange
    renderUI();

    // assert
    expect(screen.getAllByText('🧝‍♀️')[0].closest('button')).toHaveAttribute('data-state', 'back');
    expect(screen.getAllByText('🍪')[0].closest('button')).toHaveAttribute('data-state', 'back');

    // act
    fireEvent.click(screen.getAllByText('🧝‍♀️')[0]);
    fireEvent.click(screen.getAllByText('🍪')[0]);

    // assert
    expect(screen.getAllByText('🧝‍♀️')[0].closest('button')).toHaveAttribute('data-state', 'front');
    expect(screen.getAllByText('🍪')[0].closest('button')).toHaveAttribute('data-state', 'front');
  });

  it('should disable all cards and show game over when time is up', () => {
    // arrange
    renderUI();

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(screen.getByText('Game over!😰')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('modal-close'));

    expect(screen.getByTestId('time-counter')).toHaveTextContent('0');

    screen.getAllByTestId('card').forEach(el => expect(within(el).getByRole('button')).toBeDisabled());
  });

  it('should disable all cards and show cards front when click on solution', () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByText('🔍Solution'));

    expect(screen.getByTestId('time-counter')).toHaveTextContent('0');

    screen.getAllByTestId('card').forEach(el => expect(within(el).getByRole('button')).toBeDisabled());
    screen.getAllByTestId('card').forEach(el => expect(within(el).getByRole('button')).toHaveAttribute('data-state', 'front'));
  });

  it('should reset the time counter and flip down all cards when click on Restart', () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByText('🔄 Restart'));

    expect(screen.getByTestId('time-counter')).toHaveTextContent('60');

    screen.getAllByTestId('card').forEach(el => expect(within(el).getByRole('button')).not.toBeDisabled());
    screen.getAllByTestId('card').forEach(el => expect(within(el).getByRole('button')).toHaveAttribute('data-state', 'back'));
  });

  it('should draw the cards from the emojis of the active theme', () => {
    renderUI();

    expect(arrayUtils.getRandomSubarray).toHaveBeenCalledWith(themes.christmas.emojis, 8);
  });

  it('should deal a new board with the new emojis when the theme changes', () => {
    renderUI();
    screen.getAllByText('🧝‍♀️').forEach(el => fireEvent.click(el));
    expect(screen.getByTestId('move-counter')).toHaveTextContent('1');

    act(() => useThemeStore.getState().setSelection('halloween'));

    expect(arrayUtils.getRandomSubarray).toHaveBeenLastCalledWith(themes.halloween.emojis, 8);
    expect(screen.getByTestId('move-counter')).toHaveTextContent('0');
    expect(screen.getByTestId('left-pairs')).toHaveTextContent('8');
  });

  it('should show the theme icon on the back of the cards', () => {
    renderUI();

    expect(screen.getAllByTestId('card-back-icon')[0]).toHaveTextContent(themes.christmas.icon);
  });

  it('should make both cards of a pair bounce when they match', () => {
    renderUI();

    screen.getAllByText('🧝‍♀️').forEach(el => fireEvent.click(el));

    screen.getAllByText('🧝‍♀️').forEach(el => expect(el.closest('[data-testid="card"]')).toHaveAttribute('data-feedback', 'match'));
    screen.getAllByText('🌟').forEach(el => expect(el.closest('[data-testid="card"]')).not.toHaveAttribute('data-feedback'));
  });

  it('should shake the two cards of a wrong pair, then reset them', () => {
    renderUI();

    fireEvent.click(screen.getAllByText('🌟')[0]);
    fireEvent.click(screen.getAllByText('🍪')[0]);

    expect(screen.getAllByText('🌟')[0].closest('[data-testid="card"]')).toHaveAttribute('data-feedback', 'mismatch');
    expect(screen.getAllByText('🍪')[0].closest('[data-testid="card"]')).toHaveAttribute('data-feedback', 'mismatch');
    expect(screen.getAllByText('🌟')[1].closest('[data-testid="card"]')).not.toHaveAttribute('data-feedback');

    act(() => {
      vi.advanceTimersByTime(gameConfiguration.flipBackTime);
    });

    expect(screen.getAllByText('🌟')[0].closest('[data-testid="card"]')).not.toHaveAttribute('data-feedback');
    expect(screen.getAllByText('🌟')[0].closest('button')).toHaveAttribute('data-state', 'back');
  });

  it('should not freeze the board after a wrong pair: clicking another card turns the pair back at once', () => {
    renderUI();

    fireEvent.click(screen.getAllByText('🌟')[0]);
    fireEvent.click(screen.getAllByText('🍪')[0]);
    expect(screen.getAllByText('🌟')[0].closest('button')).toHaveAttribute('data-state', 'front');

    // The player goes on right away, before the wrong pair has been turned back.
    fireEvent.click(screen.getAllByText('🦌')[0]);

    expect(screen.getAllByText('🌟')[0].closest('button')).toHaveAttribute('data-state', 'back');
    expect(screen.getAllByText('🍪')[0].closest('button')).toHaveAttribute('data-state', 'back');
    expect(screen.getAllByText('🦌')[0].closest('button')).toHaveAttribute('data-state', 'front');

    // The cancelled timer does not turn the new card back.
    act(() => {
      vi.advanceTimersByTime(gameConfiguration.flipBackTime);
    });
    expect(screen.getAllByText('🦌')[0].closest('button')).toHaveAttribute('data-state', 'front');

    // And the move can be completed.
    fireEvent.click(screen.getAllByText('🦌')[1]);
    expect(screen.getByTestId('left-pairs')).toHaveTextContent('7');
  });

  it('should not apply a pending flip-back of the previous board after Restart', () => {
    renderUI();
    fireEvent.click(screen.getAllByText('🌟')[0]);
    fireEvent.click(screen.getAllByText('🍪')[0]);

    fireEvent.click(screen.getByText('🔄 Restart'));
    fireEvent.click(screen.getAllByText('🦌')[0]);
    act(() => {
      vi.advanceTimersByTime(gameConfiguration.flipBackTime * 2);
    });

    expect(screen.getAllByText('🦌')[0].closest('button')).toHaveAttribute('data-state', 'front');
    expect(screen.getByTestId('move-counter')).toHaveTextContent('0');
  });

  it('should clear the pending flip-back when the game screen is closed', () => {
    const { unmount } = renderUI();
    fireEvent.click(screen.getAllByText('🌟')[0]);
    fireEvent.click(screen.getAllByText('🍪')[0]);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
