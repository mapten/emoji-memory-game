import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Hooks
import { useThemeSync } from './hooks/useThemeSync';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
// Components
import { Home } from './components/containers/Home/Home';
import { DifficultyLevelSelector } from './components/containers/DifficultyLevelSelector/DifficultyLevelSelector';
import { Game } from './components/containers/Game/Game';
import { ThemedBackground } from './components/containers/ThemedBackground/ThemedBackground';
import { ThemeControls } from './components/containers/ThemeControls/ThemeControls';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/select-difficulty',
    element: <DifficultyLevelSelector />
  },
  {
    path: '/game',
    element: <Game />
  },
]);

export const App = () => {
  useThemeSync();
  usePerformanceMonitor();

  return (
    <>
      <ThemedBackground />
      <div className="relative">
        <RouterProvider router={router} />
      </div>
      <ThemeControls />
    </>
  );
};
