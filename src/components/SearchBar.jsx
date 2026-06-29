import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../store/slices/postsSlice';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
    const dispatch = useDispatch();
    const { searchQuery } = useSelector((state) => state.posts);

    return (
        <div className="relative group hidden sm:block">
            <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
            />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search articles..."
                className="bg-surface-container-high/50 dark:bg-white/5 border border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-white/5 rounded-full pl-10 pr-10 py-2 text-sm w-64 outline-none transition-all focus:ring-4 focus:ring-primary/10"
            />
            {searchQuery && (
                <button
                    onClick={() => dispatch(setSearchQuery(''))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}