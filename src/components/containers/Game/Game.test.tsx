import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as arrayUtils from '../../../utils/array.utils';

import { render, fireEvent, screen, act, within } from '@testing-library/react';
import { Game } from './Game';
import { MemoryRouter } from 'react-router-dom';

describe('Game', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  const baseEmojis = ['🧝‍♀️', '🌟', '🍪', '🦌', '🕯️', '👼', '🥳', '🎊'];

  beforeEach(() => {
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
});