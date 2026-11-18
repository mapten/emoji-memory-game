export interface CardState {
  id: string;
  emoji: string;
  isFlipped: boolean;
  isDisabled: boolean;
  isMatched: boolean;
  // Animation played once both cards of a move are face up: pair found, or wrong pair.
  feedback?: 'match' | 'mismatch';
}