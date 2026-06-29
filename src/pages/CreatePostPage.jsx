import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setEditorField, resetEditor, setActiveTab } from '../store/slices/editorSlice';
import { addPost, updatePost } from '../store/slices/postsSlice';
import RichTextEditor from '../components/RichTextEditor';
import AIAssistant from '../components/AIAssistant';
import { Eye, Send, X } from 'lucide-react';

export default function CreatePostPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug } = useParams();
    const { posts } = useSelector((state) => state.posts);
    const post = posts.find((p) => p.slug === slug);

    const { title, content, summary, category, tags, activeTab } = useSelector(
        (state) => state.editor
    );

    useEffect(() => {
        if (slug && post) {
            dispatch(setEditorField({ field: 'title', value: post.title }));
            dispatch(setEditorField({ field: 'content', value: post.content }));
            dispatch(setEditorField({ field: 'summary', value: post.summary }));
            dispatch(setEditorField({ field: 'category', value: post.category }));
            dispatch(setEditorField({ field: 'tags', value: post.tags.join(', ') }));
        } else {
            dispatch(resetEditor());
        }

        return () => {
            dispatch(resetEditor());
        };
    }, [slug, post, dispatch]);

    const generateSlug = (text) => {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    };

    const handlePublish = () => {
        if (!title.trim() || !content.trim()) return;

        const newSlug = generateSlug(title);

        if (slug && post) {
            dispatch(
                updatePost({
                    id: post.id,
                    title,
                    content,
                    summary: summary || title,
                    category,
                    tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                    slug: newSlug,
                })
            );
            navigate(`/post/${newSlug}`);
        } else {
            dispatch(
                addPost({
                    title,
                    content,
                    summary: summary || title,
                    category,
                    tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                    slug: newSlug,
                    author: {
                        name: 'Jane Doe',
                        initials: 'JD',
                        role: 'Senior Creative Developer',
                        color: 'bg-primary/20 text-primary',
                    },
                })
            );
            navigate('/');
        }

        dispatch(resetEditor());
    };

    return (
        <div>
            <header className="mb-12 max-w-3xl">
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 tracking-tight dark:text-white">
                    {slug && post ? (
                        <>Edit <span className="text-primary italic">Your</span> Article</>
                    ) : (
                        <>Create <span className="text-primary italic">New</span> Article</>
                    )}
                </h1>
                <p className="text-lg text-on-surface-variant/80 dark:text-blue-200">
                    {slug && post ? 'Refine your narrative with the assistance of intelligent tools.' : 'Craft your narrative with the assistance of intelligent tools.'}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
                <section className="space-y-8">
                    <div className="aura-glass rounded-xl p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-3xl pointer-events-none" />

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => dispatch(setEditorField({ field: 'title', value: e.target.value }))}
                            placeholder="Enter your article title..."
                            className="w-full bg-transparent border-none focus:ring-0 font-display text-3xl md:text-4xl p-0 placeholder:text-on-surface-variant/20 dark:text-white mb-6"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest dark:text-white/40">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => dispatch(setEditorField({ field: 'category', value: e.target.value }))}
                                    className="w-full bg-on-surface/5 dark:bg-white/5 border-none rounded-lg focus:ring-2 focus:ring-primary/20 dark:text-white py-3 px-4 dark:bg-surface-dark"
                                >
                                    <option>Technology</option>
                                    <option>Design</option>
                                    <option>Business</option>
                                    <option>Lifestyle</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest dark:text-white/40">Tags</label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => dispatch(setEditorField({ field: 'tags', value: e.target.value }))}
                                    placeholder="Add tags (separated by comma)"
                                    className="w-full bg-on-surface/5 dark:bg-white/5 border-none rounded-lg focus:ring-2 focus:ring-primary/20 dark:text-white py-3 px-4 placeholder:text-on-surface-variant/30"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => dispatch(setActiveTab('edit'))}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'edit' ? 'bg-primary text-white' : 'bg-on-surface/5 hover:bg-on-surface/10 dark:text-white'}`}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => dispatch(setActiveTab('preview'))}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-primary text-white' : 'bg-on-surface/5 hover:bg-on-surface/10 dark:text-white'}`}
                            >
                                <Eye size={14} /> Preview
                            </button>
                        </div>

                        {activeTab === 'edit' ? (
                            <RichTextEditor />
                        ) : (
                            <div
                                className="min-h-[400px] prose dark:prose-invert max-w-none leading-relaxed p-4 bg-on-surface/5 dark:bg-white/5 rounded-xl"
                                dangerouslySetInnerHTML={{ __html: content || '<p class="text-on-surface-variant/30 italic">Nothing to preview yet...</p>' }}
                            />
                        )}
                    </div>

                    <div className="aura-glass rounded-xl p-8">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <label className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest dark:text-gray-400">Article Summary</label>
                                <p className="text-[11px] text-on-surface-variant/50 mt-1 dark:text-gray-300">Auto-generated or custom entry</p>
                            </div>
                        </div>
                        <textarea
                            value={summary}
                            onChange={(e) => dispatch(setEditorField({ field: 'summary', value: e.target.value }))}
                            placeholder="A brief hook for your article preview..."
                            rows={3}
                            className="w-full bg-on-surface/5 dark:bg-white/5 border border-on-surface/5 rounded-xl focus:ring-2 focus:ring-primary/20 dark:text-white p-4 leading-relaxed placeholder:text-on-surface-variant/30"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            onClick={() => {
                                dispatch(resetEditor());
                                navigate(slug && post ? `/post/${post.slug}` : '/');
                            }}
                            className="px-8 py-3 rounded-full text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 transition-all flex items-center gap-2 dark:text-gray-300 dark:hover:text-pink-400"
                        >
                            <X size={16} /> Discard
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={!title.trim() || !content.trim()}
                            className="px-10 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-container hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send size={16} /> {slug && post ? 'Save Changes' : 'Publish Article'}
                        </button>
                    </div>
                </section>

                <aside className="space-y-8 sticky top-28">
                    <AIAssistant />

                    <div className="aura-glass rounded-xl p-6 border border-secondary/10">
                        <h3 className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-4 flex items-center gap-2 dark:text-white/80">
                            <span className="w-2 h-2 rounded-full bg-secondary" /> Writing Tips
                        </h3>
                        <ul className="space-y-4">
                            {[
                                'Start with a compelling hook to grab attention immediately.',
                                'Keep paragraphs short for better digital readability.',
                                'Use subheadings to guide readers through sections.',
                            ].map((tip, i) => (
                                <li key={i} className="flex gap-3 text-sm text-on-surface-variant/80 dark:text-white/80">
                                    <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold shrink-0">
                                        {i + 1}
                                    </span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}