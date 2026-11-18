import { useNavigate } from 'react-router-dom';

// Styles
import './Home.css';
// Hooks
import { useActiveTheme } from '../../../hooks/useActiveTheme';
// Components
import { Button } from '../../ui/Button/Button';

export const Home = () => {
  const navigate = useNavigate();
  const theme = useActiveTheme();

  const startGameHandler = () => {
    navigate('/select-difficulty');
  };

  return (
    <div className="h-screen w-screen">
      <div className="flex flex-col opacity-100 items-center justify-center h-full p-4">
        <div className="bg-[rgba(255,255,255,0.9)] p-4 lg:p-8 rounded-3xl">
          <div className="text-3xl lg:text-6xl text-primary">
          👋Welcome to Emoji Memory Game!
          </div>
          {/* The stamp is only shown for special periods (holidays), not for regular seasons. */}
          {theme.kind === 'holiday' && (
            <div className="flex justify-end mt-4">
              <div data-testid="edition-stamp" className="text-xl lg:text-3xl p-2 font-bold border-stamp border-4 inline-flex items-center gap-2 text-stamp uppercase -rotate-12 stamp">
                <span className="stamp-icon text-2xl lg:text-4xl" aria-hidden="true">{theme.icon}</span>
                {theme.name} Edition
              </div>
            </div>
          )}
          <div className="flex justify-center mt-8">
            <Button onClick={startGameHandler} className="text-xl lg:text-4xl">
              Start game 🚀
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
