import { useDispatch, useSelector } from 'react-redux';
import { generateSummary, fetchSuggestions, checkGrammar } from '../store/slices/editorSlice';
import { Sparkles, Wand2, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function AIAssistant() {
    const dispatch = useDispatch();
    const {
        content,
        aiSummary,
        suggestions,
        grammarScore,
        loadingSummary,
        loadingSuggestions,
        loadingGrammar,
        errorSummary,
        errorSuggestions,
        errorGrammar
    } = useSelector(
        (state) => state.editor
    );

    const plainText = content.replace(/<[^>]*>/g, '').trim()
    const isContentTooShort = plainText.length <= 50


    const handleSummarize = () => {
        if (!isContentTooShort) dispatch(generateSummary(content));
    };

    const handleSuggestions = () => {
        if (!isContentTooShort) dispatch(fetchSuggestions(content));
    };

    const handleGrammar = () => {
        if (!isContentTooShort) dispatch(checkGrammar(content));
    };

    return (
        <div className="aura-glass rounded-xl overflow-hidden">
            <div className="p-6">
                <div className="flex items-center gap-3 text-primary mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Sparkles size={20} />
                    </div>
                    <h2 className="font-display text-xl font-bold dark:text-white">AI Co-Pilot</h2>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleSummarize}
                        disabled={loadingSummary || isContentTooShort}
                        className="sidebar-action w-full flex items-center justify-between p-4 rounded-xl bg-on-surface/5 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all text-left border border-transparent hover:border-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <span className="font-bold text-sm dark:text-gray-400">Auto-Summarize</span>
                        {loadingSummary ? <Loader2 size={16} className="animate-spin text-primary" /> : <Wand2 size={16} className="text-primary" />}
                    </button>

                    <button
                        onClick={handleSuggestions}
                        disabled={loadingSuggestions || isContentTooShort}
                        className="sidebar-action w-full flex items-center justify-between p-4 rounded-xl bg-on-surface/5 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all text-left border border-transparent hover:border-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <span className="font-bold text-sm dark:text-gray-400">Content Suggestions</span>
                        {loadingSuggestions ? <Loader2 size={16} className="animate-spin text-primary" /> : <Wand2 size={16} className="text-primary" />}
                    </button>

                    <button
                        onClick={handleGrammar}
                        disabled={loadingGrammar || isContentTooShort}
                        className="sidebar-action w-full flex items-center justify-between p-4 rounded-xl bg-on-surface/5 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all text-left border border-transparent hover:border-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <div>
                            <span className="font-bold text-sm dark:text-gray-400">Proofread & Score</span>
                            <div className="flex gap-1.5 mt-2">
                                <div className="h-1.5 w-10 bg-primary rounded-full" />
                                <div className="h-1.5 w-10 bg-primary rounded-full" />
                                <div className="h-1.5 w-5 bg-on-surface/10 rounded-full" />
                            </div>
                        </div>
                        {loadingGrammar ? <Loader2 size={16} className="animate-spin text-primary" /> : <Wand2 size={16} className="text-primary" />}
                    </button>
                </div>
                {errorSummary && (
                    <div className="mt-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-500 shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errorSummary}
                        </p>
                    </div>
                )}
                {aiSummary && (
                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Generated Summary</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed dark:text-pink-100">{aiSummary}</p>
                    </div>
                )}

                {errorSuggestions && (
                    <div className="mt-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-500 shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errorSuggestions}
                        </p>
                    </div>
                )}
                {suggestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider">Suggestions</p>
                        {suggestions.map((s, i) => (
                            <div key={i} className="flex gap-2 text-sm text-on-surface-variant dark:text-blue-200">
                                <CheckCircle size={14} className="text-primary shrink-0 mt-0.5 dark:text-blue-200" />
                                <span>{s}</span>
                            </div>
                        ))}
                    </div>
                )}
                {errorGrammar && (
                    <div className="mt-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-500 shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errorGrammar}
                        </p>
                    </div>
                )}
                {grammarScore && (
                    <div className="mt-4 p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-secondary uppercase tracking-wider dark:text-blue-400">Readability Score</span>
                            <span className="text-2xl font-bold text-secondary dark:text-blue-500">{grammarScore.score}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant mb-2 dark:text-blue-200">{grammarScore.grade}</p>
                        <div className="text-xs text-on-surface-variant/70 dark:text-blue-200">
                            {grammarScore.stats.wordCount} words · {grammarScore.stats.sentenceCount} sentences
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}