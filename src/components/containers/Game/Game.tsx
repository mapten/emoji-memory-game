import { useLocation } from 'react-router-dom';
import { Fragment, createRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

// Configuration
import { gameConfiguration, levels } from '../../../configuration/game.configuration';
// Models
import { CardState } from '../../../models/cardState.model';
import { Level as LevelModel } from '../../../models/level.model';
// Utils
import { getRandomSubarray, shuffleArray } from '../../../utils/array.utils';
// Hooks
import { useScreenOrientation } from '../../../hooks/useScreenOrientation';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
// Components
import { Card } from '../../presentational/Card/Card';
import { GamePanel, TimeCounterRefType } from '../../presentational/GamePanel/GamePanel';
import { GameOver } from '../../presentational/GameOver/GameOver';
import { YouWon } from '../../presentational/YouWon/YouWon';

/**
 * The Game component represents the main game screen.
 * It manages the state of the game, including the cards, moves, remaining pairs, and game over/win status.
 * The component also handles user interactions such as card clicks and game restarts.
 */
export const Game = () => {
  const timeCounterRef = createRef<TimeCounterRefType>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const difficulty = queryParams.get('difficulty');

  const screenOrientation = useScreenOrientation();
  const theme = useActiveTheme();
  const [cards, setCards] = useState<CardState[]>([]);
  const [level, setLevel] = useState<LevelModel>(levels[0]);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [remainingPairs, setRemainingPairs] = useState<number>(0);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [showYouWon, setShowYouWon] = useState<boolean>(false);

  const disableAllCards = () => {
    setCards((updatedCards) => updatedCards.map((c) => ({...c, isDisabled: true})));
  };

  const flipAllCards = () => {
    setCards((updatedCards) => updatedCards.map((c) => ({...c, isFlipped: true})));
  };

  // Timer that turns a wrong pair face down again (null when no wrong pair is displayed).
  const flipBackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelFlipBack = () => {
    if (flipBackTimer.current) {
      clearTimeout(flipBackTimer.current);
      flipBackTimer.current = null;
    }
  };

  /** Turns the wrong pair face down and makes every unmatched card playable again. */
  const turnWrongPairBack = (list: CardState[]): CardState[] => list.map((c) => {
    if (c.isMatched || (!c.isFlipped && !c.isDisabled && !c.feedback)) return c; // unchanged: not re-rendered
    return { ...c, isFlipped: false, isDisabled: false, feedback: undefined };
  });

  const cardClickHandle = (cardId: string) => {
    let currentCards = cards;

    // A wrong pair is still displayed: the player has already started the next move,
    // so turn the pair back right away instead of ignoring the click.
    if (flipBackTimer.current) {
      cancelFlipBack();
      currentCards = turnWrongPairBack(currentCards);
    }

    const card = currentCards.find((c) => c.id === cardId);
    if (!card || card.isMatched || card.isDisabled) {
      if (currentCards !== cards) setCards(currentCards);
      return;
    }

    // Flip the selected card, and disable it
    const updatedCards = currentCards.map((c) => {
      if (c.id === card.id) {
        return {
          ...c,
          isFlipped: true,
          isDisabled: true,
        };
      }
      return c;
    });
    setCards(updatedCards);

    const flippedCards = updatedCards.filter((c) => c.isFlipped && !c.isMatched);

    if (flippedCards.length === 2) {
      setMoveCount((moveCount) => moveCount + 1);

      if (flippedCards[0].emoji === flippedCards[1].emoji) {
        setRemainingPairs((remainingPairs) => {
          const remainingPairsAfterMatch = remainingPairs - 1;

          if (remainingPairsAfterMatch === 0) {
            youWonHandler();
          }

          return remainingPairsAfterMatch;
        });
        const pairIds = flippedCards.map((c) => c.id);
        const matchedCards = updatedCards.map((c) => {
          if (pairIds.includes(c.id)) {
            return {
              ...c,
              isMatched: true,
              isDisabled: true,
              // The two cards of the pair celebrate (bounce).
              feedback: 'match' as const,
            };
          }
          return c;
        });

        setCards(matchedCards);
        return;
      }

      // If the cards don't match, they shake, then flip back after `flipBackTime`.
      // Both stay disabled meanwhile; the other cards remain playable (clicking one turns the pair back at once).
      const wrongPairIds = flippedCards.map((c) => c.id);
      setCards(updatedCards.map((c) => (wrongPairIds.includes(c.id) ? { ...c, feedback: 'mismatch' as const } : c)));

      flipBackTimer.current = setTimeout(() => {
        flipBackTimer.current = null;
        setCards((current) => turnWrongPairBack(current));
      }, gameConfiguration.flipBackTime);
    }
  };

  // Stable click handler per card, so a click re-renders only the cards that change (Card is memoized).
  const latestCardClickHandle = useRef(cardClickHandle);
  useLayoutEffect(() => {
    latestCardClickHandle.current = cardClickHandle;
  });
  const deckKey = cards.map((c) => c.id).join('|');
  const cardClickHandlers = useMemo(
    () => new Map(cards.map((c) => [c.id, () => latestCardClickHandle.current(c.id)])),
    [deckKey],
  );

  // No wrong pair left to turn back once the game screen is closed.
  useEffect(() => cancelFlipBack, []);

  const timeUpHandler = () => {
    cancelFlipBack();
    setShowGameOver(true);
    disableAllCards();
  };

  const startAgainHandler = () => {
    // A wrong pair of the previous board must not be turned back on the new one.
    cancelFlipBack();
    initializeCards(difficulty as string);
    timeCounterRef.current?.restartCountdown();
    setMoveCount(0);
  };

  const showSolutionHandler = () => {
    cancelFlipBack();
    disableAllCards();
    flipAllCards();
    timeCounterRef.current?.stop();
  };

  const youWonHandler = () => {
    setShowYouWon(true);
    disableAllCards();
    timeCounterRef.current?.stop();
  };


  const initializeCards = (difficulty: string) => {
    const level = levels.find((level) => level.name === difficulty) as LevelModel;
    const pairs = level.horizontalCards * level.verticalCards / 2;

    setRemainingPairs(pairs);

    // Cards are drawn from the emojis of the active theme (season or holiday).
    const selectedEmojis = getRandomSubarray(theme.emojis, pairs);

    const shuffledEmojis = shuffleArray([...selectedEmojis, ...selectedEmojis]);

    const newCards = shuffledEmojis.map((emoji, index) => ({
      id: `${index}-${emoji}`,
      emoji,
      isFlipped: false,
      isMatched: false,
      isDisabled: false,
    }));

    setCards(newCards);
  };

  useEffect(() => {
    if (!difficulty) return;

    initializeCards(difficulty);
  }, [difficulty]);

  useEffect(() => {
    const level = levels.find((level) => level.name === difficulty) as LevelModel;

    setLevel(level);
  }, [difficulty]);

  // When the theme changes during a game (picked by the player, or a new period starting),
  // deal a fresh board with the new theme's emojis.
  const dealtThemeId = useRef(theme.id);
  useEffect(() => {
    if (dealtThemeId.current === theme.id) return;
    dealtThemeId.current = theme.id;
    if (!difficulty) return;

    startAgainHandler();
  }, [theme.id]);

  const verticalCards = screenOrientation === 'landscape' ? level.verticalCards : level.horizontalCards;
  const horizontalCards = screenOrientation === 'landscape' ? level.horizontalCards : level.verticalCards;

  return (
    <div className="flex p-2 md:p-4 xl:p-8 h-screen w-screen overflow-hidden" style={{flexDirection: screenOrientation === 'landscape' ? 'row' : 'column'}}>
      <div className="flex flex-col gap-2 lg:gap-8 mb-2 md:mr-4 lg:mr-8">
        <GamePanel
          ref={timeCounterRef}
          moves={moveCount}
          remainingPairs={remainingPairs}
          onTimeUp={timeUpHandler}
          onStartAgain={startAgainHandler}
          onShowSolution={showSolutionHandler} />
      </div>
      <div className="grid gap-2 lg:gap-3 xl:gap-6 mx-auto my-auto"
        style={{gridTemplateColumns: `repeat(${verticalCards}, 1fr)`, gridTemplateRows: `repeat(${horizontalCards}, 1fr)`,
        }}>
        { cards.map((card) => (
          <Fragment key={card.id}>
            <Card
              emoji={card.emoji}
              backIcon={theme.icon}
              feedback={card.feedback}
              disabled={card.isDisabled}
              initialShowBack={!card.isFlipped}
              onClick={cardClickHandlers.get(card.id) as () => void} />
          </Fragment>
        ))}
      </div>
      { showGameOver && <GameOver onClose={() => setShowGameOver(false)} onStartAgain={startAgainHandler} />}
      { showYouWon && <YouWon onClose={() => setShowYouWon(false)} onStartAgain={startAgainHandler} />}
    </div>
  );
};