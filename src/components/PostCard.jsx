import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark } from '../store/slices/postsSlice';
import { Clock, ArrowRight, ThumbsUp, MessageSquare, Bookmark } from 'lucide-react';

export default function PostCard({ post }) {
    const dispatch = useDispatch();
    const bookmarkedPostIds = useSelector((state) => state.posts.bookmarkedPostIds) || [];
    const isBookmarked = bookmarkedPostIds.includes(post.id);

    const categoryColors = {
        Technology: 'text-primary',
        Design: 'text-secondary',
        Business: 'text-tertiary',
    };

    return (
        <article className="glass-card card-hover-effect rounded-xl overflow-hidden flex flex-col h-full relative group">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    dispatch(toggleBookmark(post.id));
                }}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all z-10 ${isBookmarked
                    ? 'bg-primary/20 border-primary/40 text-primary scale-110'
                    : 'bg-white/40 dark:bg-white/5 border-white/20 dark:text-white/35 dark:border-white/10 text-on-surface-variant/70 hover:text-primary hover:bg-white dark:hover:bg-white/10'
                    }`}
                title={isBookmarked ? "Remove Bookmark" : "Bookmark Post"}
            >
                <Bookmark size={14} className={isBookmarked ? "fill-primary" : ""} />
            </button>

            <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                    <div className="flex justify-between items-center mb-4 pr-8">
                        <span className={`text-xs font-bold tracking-widest uppercase ${categoryColors[post.category] || 'text-primary'}`}>
                            {post.category}
                        </span>
                        <div className="flex items-center gap-3 text-on-surface-variant/70 text-xs font-semibold dark:text-white/55">
                            <div className="flex items-center gap-1 " title="Reading Time">
                                <Clock size={13} />
                                <span>{post.readTime} min</span>
                            </div>
                            <div className="flex items-center gap-1 dark:text-white/55" title="Likes">
                                <ThumbsUp size={13} className="text-on-surface-variant/50 dark:text-white/55" />
                                <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1" title="Comments">
                                <MessageSquare size={13} className="text-on-surface-variant/50 dark:text-white/55" />
                                <span>{post.comments ? post.comments.length : 0}</span>
                            </div>
                        </div>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-3 dark:text-white group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-on-surface-variant/80 mb-6 line-clamp-2 text-sm leading-relaxed dark:text-blue-200">
                        {post.summary}
                    </p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${post.author.color}`}>
                            {post.author.initials}
                        </div>
                        <span className="font-bold text-sm dark:text-white/80">{post.author.name}</span>
                    </div>
                    <Link
                        to={`/post/${post.slug}`}
                        className="text-primary font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-sm"
                    >
                        Read <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </article>
    );
}