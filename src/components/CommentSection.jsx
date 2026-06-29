import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment, likeComment, addCommentReply, likeCommentReply } from '../store/slices/postsSlice';
import { MessageCircle, ThumbsUp, Send, CornerDownRight, X } from 'lucide-react';
import { timeAgo } from '../utils/helpers';

export default function CommentSection({ post }) {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const [name, setName] = useState('');

    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyName, setReplyName] = useState('');
    const [replyText, setReplyText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() || !name.trim()) return;

        dispatch(
            addComment({
                postId: post.id,
                comment: {
                    author: name,
                    initials: name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
                    text: text.trim(),
                    color: 'bg-primary/20 text-primary',
                },
            })
        );
        setText('');
        setName("");
    };

    const handleReplySubmit = (e, commentId) => {
        e.preventDefault();
        const authorName = replyName.trim() || name.trim();
        if (!replyText.trim() || !authorName) return;

        dispatch(
            addCommentReply({
                postId: post.id,
                commentId,
                reply: {
                    author: authorName,
                    initials: authorName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
                    text: replyText.trim(),
                    color: 'bg-secondary/20 text-secondary',
                }
            })
        );

        setReplyText('');
        setReplyName("");
        setActiveReplyId(null);
    };

    const totalComments = (post.comments || []).reduce((acc, c) => acc + 1 + (c.replies ? c.replies.length : 0), 0);

    return (
        <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
                <MessageCircle className="text-primary" size={24} />
                <h2 className="font-display text-2xl font-bold dark:text-white">
                    Discussions <span className="text-on-surface-variant/50 font-normal dark:text-gray-400">({totalComments})</span>
                </h2>
            </div>

            <div className="space-y-6 mb-8">
                {(post.comments || []).map((comment) => (
                    <div key={comment.id} className="space-y-3">
                        <div className="glass-card p-5 rounded-xl border border-outline-variant/10">
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold dark:bg-white/40 dark:text-white shrink-0 ${comment.color || 'bg-primary/20 text-primary'}`}>
                                    {comment.initials}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-sm dark:text-white">{comment.author}</h4>
                                        <span className="text-on-surface-variant/60 text-xs dark:text-gray-400">{timeAgo(comment.date)}</span>
                                    </div>
                                    <p className="text-on-surface-variant text-sm leading-relaxed dark:text-gray-300">{comment.text}</p>
                                    <div className="flex gap-4 mt-3 text-on-surface-variant/60">
                                        <button
                                            onClick={() => dispatch(likeComment({ postId: post.id, commentId: comment.id }))}
                                            className="flex items-center gap-1 hover:text-primary transition-colors text-xs font-semibold dark:text-lime-100 dark:hover:text-primary"
                                            aria-label={`Like comment by ${comment.author}`}
                                        >
                                            <ThumbsUp size={14} /> {comment.likes || 0}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveReplyId(comment.id);
                                                setReplyName(name);
                                            }}
                                            className="flex items-center gap-1 hover:text-primary transition-colors text-xs font-semibold dark:text-lime-100 dark:hover:text-primary"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {comment.replies && comment.replies.map((reply) => (
                            <div key={reply.id} className="ml-10 md:ml-12 flex gap-3 relative pl-4 border-l-2 border-primary/20">
                                <div className="absolute top-4 left-0 w-2.5 h-0.5 bg-primary/20" />
                                <div className="glass-card p-4 rounded-xl flex-grow bg-white/20 dark:bg-white/5 border border-outline-variant/5">
                                    <div className="flex gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] dark:bg-white/40 dark:text-white font-bold shrink-0 ${reply.color || 'bg-secondary/20 text-secondary'}`}>
                                            {reply.initials}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h5 className="font-bold text-xs dark:text-white">{reply.author}</h5>
                                                <span className="text-on-surface-variant/50 text-[10px] dark:text-gray-300">{timeAgo(reply.date)}</span>
                                            </div>
                                            <p className="text-on-surface-variant dark:text-gray-400 text-xs leading-relaxed">{reply.text}</p>
                                            <div className="flex gap-4 mt-2 text-on-surface-variant/60">
                                                <button
                                                    onClick={() => dispatch(likeCommentReply({ postId: post.id, commentId: comment.id, replyId: reply.id }))}
                                                    className="flex items-center gap-1 hover:text-primary transition-colors text-[10px] font-semibold dark:text-lime-100 dark:hover:text-primary"
                                                    aria-label={`Like reply by ${reply.author}`}
                                                >
                                                    <ThumbsUp size={12} /> {reply.likes || 0}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeReplyId === comment.id && (
                            <div className="ml-10 md:ml-12 p-4 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/15 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs text-primary font-bold">
                                        <CornerDownRight size={14} /> Replying to {comment.author}
                                    </div>
                                    <button
                                        onClick={() => setActiveReplyId(null)}
                                        className="text-on-surface-variant/60 hover:text-primary"
                                        aria-label="Cancel reply"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        value={replyName}
                                        onChange={(e) => setReplyName(e.target.value)}
                                        placeholder="Your name"
                                        required
                                        className="bg-white/80 dark:bg-white/5 rounded-lg px-3 py-2 border border-outline-variant/15 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write your reply..."
                                            rows={2}
                                            required
                                            className="flex-1 bg-white/80 dark:bg-white/5 rounded-lg p-3 border border-outline-variant/15 text-xs focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-primary text-white px-4 rounded-lg font-bold hover:opacity-90 transition-all shadow-md flex items-center justify-center shrink-0"
                                            aria-label="Submit reply"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="bg-surface-container-low dark:bg-white/5 rounded-xl px-4 py-3 border border-outline-variant/20 text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
                />
                <div className="flex gap-3">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Join the discussion..."
                        rows={2}
                        required
                        className="flex-1 bg-surface-container-low dark:bg-white/5 rounded-xl p-4 border border-outline-variant/20 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none dark:text-white"
                    />
                    <button
                        type="submit"
                        className="bg-primary text-white px-6 rounded-xl font-bold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
                        aria-label="Submit comment"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </section>
    );
}