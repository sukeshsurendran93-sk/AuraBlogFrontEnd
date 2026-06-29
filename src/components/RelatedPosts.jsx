import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { getRelatedPosts } from '../utils/helpers';

export default function RelatedPosts({ currentPost, allPosts }) {
    const related = getRelatedPosts(allPosts, currentPost.id, currentPost.category);

    if (related.length === 0) return null;

    return (
        <div className="glass-card rounded-xl p-6 shadow-md">
            <h3 className="font-display font-bold text-lg mb-4 dark:text-white/90">Recommended Reading</h3>
            <div className="space-y-4">
                {related.map((post) => (
                    <Link
                        key={post.id}
                        to={`/post/${post.slug}`}
                        className="group block border-b border-outline-variant/10 pb-3 last:border-0 last:pb-0"
                    >
                        <p className="font-bold text-sm text-on-background group-hover:text-primary transition-colors leading-snug mb-1 dark:text-white">
                            {post.title}
                        </p>
                        <div className="flex items-center text-on-surface-variant/60 text-xs dark:text-gray-400">
                            <Clock size={12} className="mr-1" />
                            {post.readTime} min read
                            <ArrowRight size={12} className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}