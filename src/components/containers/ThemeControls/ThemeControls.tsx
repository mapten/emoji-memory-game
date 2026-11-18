import { useEffect, useRef, useState } from 'react';

// Configuration
import { themeOrder, themes } from '../../../configuration/themes.configuration';
// Models
import { ThemeSelection } from '../../../models/theme.model';
// Store
import { useThemeStore } from '../../../store/theme.store';
// Hooks
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { AnimationPauseReason, useAnimationPauseReason } from '../../../hooks/useAnimationsPaused';

const PAUSE_REASON_HINTS: Record<AnimationPauseReason, string> = {
  'player': '',
  'reduced-motion': ' (paused because your system asks for reduced motion)',
  'low-end-device': ' (paused to keep the game smooth on this device)',
};

const roundButtonClassName = 'h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-[rgba(255,255,255,0.9)] shadow-md hover:shadow-xl hover:scale-105 ' +
  'ease-out transition-transform text-2xl lg:text-3xl flex items-center justify-center border-4 border-primary';

type OptionProps = {
  selected: boolean;
  icon: string;
  label: string;
  hint?: string;
  onSelect: () => void;
};

const ThemeOption = ({ selected, icon, label, hint, onSelect }: OptionProps) => (
  <button
    role="menuitemradio"
    aria-checked={selected}
    onClick={onSelect}
    className={'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ' +
      (selected ? 'bg-quaternary text-white' : 'text-primary hover:bg-quaternary/15')}
  >
    <span className="text-2xl" aria-hidden="true">{icon}</span>
    <span className="flex flex-col leading-tight">
      <span className="text-lg">{label}</span>
      {hint && <span className={'text-sm ' + (selected ? 'text-white/90' : 'text-primary/70')}>{hint}</span>}
    </span>
  </button>
);

/**
 * Floating controls (bottom-right corner) to pause the background animation
 * and to choose a theme, or let the calendar choose it ("Automatic").
 */
export const ThemeControls = () => {
  const theme = useActiveTheme();
  const pauseReason = useAnimationPauseReason();
  const paused = pauseReason !== null;
  const selection = useThemeStore((state) => state.selection);
  const autoTheme = themes[useThemeStore((state) => state.autoThemeId)];
  const setSelection = useThemeStore((state) => state.setSelection);
  const setAnimationsPaused = useThemeStore((state) => state.setAnimationsPaused);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const select = (value: ThemeSelection) => setSelection(value);

  const renderGroup = (title: string, kind: 'season' | 'holiday') => (
    <div role="group" aria-label={title}>
      <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-primary/60">{title}</div>
      {themeOrder.filter((id) => themes[id].kind === kind).map((id) => (
        <ThemeOption
          key={id}
          selected={selection === id}
          icon={themes[id].icon}
          label={themes[id].name}
          onSelect={() => select(id)}
        />
      ))}
    </div>
  );

  return (
    <div ref={containerRef} data-testid="theme-controls" className="fixed bottom-3 right-3 lg:bottom-5 lg:right-5 z-40 flex items-end gap-2">
      {menuOpen && (
        <div
          role="menu"
          aria-label="Theme"
          className="absolute bottom-16 lg:bottom-20 right-0 w-64 max-h-[75vh] overflow-y-auto p-2 rounded-2xl bg-[rgba(255,255,255,0.95)] shadow-xl border-4 border-primary theme-menu"
        >
          <ThemeOption
            selected={selection === 'auto'}
            icon="✨"
            label="Automatic"
            hint={`Today: ${autoTheme.icon} ${autoTheme.name}`}
            onSelect={() => select('auto')}
          />
          {renderGroup('Seasons', 'season')}
          {renderGroup('Holidays', 'holiday')}
        </div>
      )}
      <button
        className={roundButtonClassName}
        onClick={() => setAnimationsPaused(!paused)}
        aria-pressed={paused}
        aria-label={paused ? 'Play background animation' : 'Pause background animation'}
        title={pauseReason ? `Play background animation${PAUSE_REASON_HINTS[pauseReason]}` : 'Pause background animation'}
      >
        <span aria-hidden="true">{paused ? '▶️' : '⏸️'}</span>
      </button>
      <button
        className={roundButtonClassName}
        onClick={() => setMenuOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label={`Change theme (current: ${theme.name})`}
        title="Change theme"
      >
        <span aria-hidden="true">{theme.icon}</span>
      </button>
    </div>
  );
};
