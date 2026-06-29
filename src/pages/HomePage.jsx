import { useSelector, useDispatch } from 'react-redux';
import { setCategory, setPage } from '../store/slices/postsSlice';
import PostCard from '../components/PostCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
    const dispatch = useDispatch();
    const { posts, filteredPosts, selectedCategory, currentPage, searchQuery } = useSelector(
        (state) => state.posts
    );
    const ITEMS_PER_PAGE = 6;

    const categories = [
        'All',
        'Bookmarked',
        ...new Set(posts.map((post) => post.category).filter(Boolean))
    ];

    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div>
            <section className="text-center mb-16 space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm animate-float">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Premium Blog Platform</span>
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-black leading-none tracking-tighter dark:text-white">
                    Ideas worth <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">reading</span>
                </h1>
                <p className="text-lg text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed opacity-90 dark:text-white/50">
                    Discover curated articles on technology, design, and culture — written by brilliant minds for curious ones.
                </p>
            </section>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => dispatch(setCategory(cat))}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${selectedCategory === cat
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white/50 dark:bg-white/5 dark:text-white/40 backdrop-blur-md border border-white/30 dark:border-white/10 text-on-surface-variant dark:text-tertiary-fixed-dim hover:bg-primary/5 hover:text-primary'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {searchQuery && (
                <div className="text-center mb-8 text-sm text-on-surface-variant">
                    Found <span className="font-bold text-primary">{filteredPosts.length}</span> results for "{searchQuery}"
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginatedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {paginatedPosts.length === 0 && (
                <div className="text-center py-20 text-on-surface-variant">
                    <p className="text-xl font-display font-bold mb-2">No articles found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={() => dispatch(setPage(Math.max(1, currentPage - 1)))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full hover:bg-on-surface/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all dark:text-white/50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold text-on-surface-variant dark:text-white/50">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => dispatch(setPage(Math.min(totalPages, currentPage + 1)))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full hover:bg-on-surface/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all dark:text-white/50"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}