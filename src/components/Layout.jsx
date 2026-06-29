import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

export default function Layout({ children }) {
    const { mode } = useSelector((state) => state.theme);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${mode === 'dark' ? 'dark bg-background-dark' : 'bg-background'}`}>
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[70%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[140px] animate-[aura-shift_20s_infinite_alternate]" />
                <div className="absolute top-[20%] -right-[15%] w-[50%] h-[60%] rounded-full bg-secondary-container/15 dark:bg-secondary-container/10 blur-[120px] animate-[aura-shift_20s_infinite_alternate]" style={{ animationDelay: '-5s' }} />
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[50%] rounded-full bg-tertiary-fixed/20 dark:bg-tertiary/10 blur-[100px] animate-[aura-shift_20s_infinite_alternate]" style={{ animationDelay: '-10s' }} />
            </div>

            <nav className="fixed top-0 w-full z-50 bg-surface/70 dark:bg-surface-dark/70 backdrop-blur-2xl border-b border-on-surface/5 transition-colors duration-300">
                <div className="flex justify-between items-center h-20 px-8 max-w-7xl mx-auto">
                    <Link to="/" className="font-display text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Aura.Log
                    </Link>
                    <div className="flex items-center gap-6">
                        <SearchBar />
                        <Link
                            to="/create"
                            className="hidden md:flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                        >
                            Write
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <main className="pt-28 pb-20 px-8 max-w-7xl mx-auto relative">
                {children}
            </main>

            <footer className="bg-surface/50 dark:bg-surface-dark/50 backdrop-blur-lg border-t border-on-surface/5 w-full py-12 transition-colors duration-300">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6">
                    <div className="font-display text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Aura.Log
                    </div>
                    <div className="text-on-surface-variant/60 text-sm dark:text-blue-200">
                        © {new Date().getFullYear()} Aura.Log. Crafted for clarity.
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-on-surface-variant/60 dark:text-green-100">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Careers</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}