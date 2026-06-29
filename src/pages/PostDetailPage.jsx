import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, toggleBookmark } from '../store/slices/postsSlice';
import { highlightText } from '../utils/helpers';
import CommentSection from '../components/CommentSection';
import RelatedPosts from '../components/RelatedPosts';
import { Clock, Share2, Bookmark, ThumbsUp, Tag, Sparkles, Pencil } from 'lucide-react';

export default function PostDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { posts, searchQuery, bookmarkedPostIds } = useSelector((state) => state.posts);

  const post = posts.find((p) => p.slug === slug);
  const isBookmarked = bookmarkedPostIds?.includes(post?.id);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <Link to="/" className="text-primary hover:underline">Back to home</Link>
      </div>
    );
  }

  const highlightedTitle = searchQuery
    ? highlightText(post.title, searchQuery)
    : post.title;

  const cleanContent = post.content
    .replace(/<p>\s*[—–-]\s*<\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p><br><\/p>/g, '');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error("Clipboard copy failed");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <article className="flex-1 min-w-0 w-full">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {post.category}
          </span>
          <div className="flex items-center text-on-surface-variant/60 text-sm dark:text-gray-300">
            <Clock size={16} className="mr-1" />
            {post.readTime} min read
          </div>
        </div>

        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 dark:text-white break-words"
          dangerouslySetInnerHTML={{ __html: highlightedTitle }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 py-6 border-y border-outline-variant/10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${post.author.color}`}>
              {post.author.initials}
            </div>
            <div>
              <p className="font-bold text-lg dark:text-white">{post.author.name}</p>
              <p className="text-on-surface-variant text-sm dark:text-gray-300">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/edit/${post.slug}`}
              className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
            >
              <Pencil size={14} />
              Edit
            </Link>
            <button
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface dark:bg-[#3d496c] hover:bg-primary hover:text-white transition-all shadow-sm"
              aria-label="Share article"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => dispatch(toggleBookmark(post.id))}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm ${isBookmarked
                ? 'bg-primary text-white'
                : 'bg-surface dark:bg-[#3d496c] hover:bg-primary hover:text-white'
                }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Post'}
            >
              <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
            </button>
            <button
              onClick={() => dispatch(likePost(post.id))}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface dark:bg-[#3d496c] hover:bg-primary hover:text-white transition-all shadow-sm"
              aria-label="Like article"
            >
              <ThumbsUp size={18} />
            </button>
            <span className="text-sm font-bold text-on-surface-variant dark:text-gray-200">{post.likes}</span>
          </div>
        </div>

        <div className="rounded-xl p-6 mb-10 border-l-4 border-primary shadow-sm bg-white/60 dark:bg-[#1a2440]/60 backdrop-blur-xl border border-white/30 dark:border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <span className="text-primary text-xs font-bold uppercase tracking-widest">AI-Generated Summary</span>
          </div>
          <p className="text-on-surface-variant dark:text-[#c9c4d6] text-lg italic leading-relaxed">
            {post.summary}
          </p>
        </div>

        <div className="article-content text-on-background font-body-lg leading-relaxed overflow-wrap-anywhere">
          <div
            className="space-y-6 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 bg-surface dark:bg-[#1a2440] hover:bg-surface-variant dark:hover:bg-[#283044] text-on-surface dark:text-[#c9c4d6] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-default"
            >
              <Tag size={12} />
              #{tag}
            </span>
          ))}
        </div>

        <CommentSection post={post} />
      </article>

      <aside className="w-full lg:w-80 lg:shrink-0 space-y-8">
        <RelatedPosts currentPost={post} allPosts={posts} />

        <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 text-center">
            <div className="text-3xl mb-3">✍️</div>
            <h3 className="font-display font-bold text-lg mb-2">Share your story</h3>
            <p className="text-white/80 text-sm mb-4">Join our community of writers on Aura.Log.</p>
            <Link
              to="/create"
              className="block w-full bg-white text-primary font-bold py-2.5 rounded-full hover:bg-opacity-90 transition-all text-sm text-center"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}