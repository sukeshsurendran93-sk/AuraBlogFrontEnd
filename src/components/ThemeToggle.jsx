import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const dispatch = useDispatch();
    const { mode } = useSelector((state) => state.theme);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2.5 rounded-full hover:bg-on-surface/5 dark:hover:bg-white/5 transition-all text-on-surface-variant dark:text-yellow-200"
            title="Toggle Theme"
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}