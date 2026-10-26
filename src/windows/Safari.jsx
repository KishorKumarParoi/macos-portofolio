import { WindowControls } from '#components'
import { PROJECT_ARTICLES } from '../constants/articles'
import WindowWrapper from '#hoc/WindowWrapper'
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    MoveRight,
    PanelLeft,
    Plus,
    SearchIcon,
    Share,
    ShieldHalf,
    ExternalLink,
    Check,
    Terminal,
    ArrowLeft,
    Clock,
    Tag,
    BookOpen,
    Maximize2,
} from 'lucide-react'
import React, { useState } from 'react'

const Safari = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedArticle, setSelectedArticle] = useState(null)
    const [copiedCmd, setCopiedCmd] = useState(false)
    const [urlBar, setUrlBar] = useState('https://kishor.tech/articles')

    const filteredArticles = PROJECT_ARTICLES.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.overview.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelectArticle = (article) => {
        setSelectedArticle(article)
        setUrlBar(`https://kishor.tech/articles/${article.slug}`)
    }

    const handleBackToList = () => {
        setSelectedArticle(null)
        setUrlBar('https://kishor.tech/articles')
    }

    const copyDeployCommand = (cmd) => {
        navigator.clipboard.writeText(cmd)
        setCopiedCmd(true)
        setTimeout(() => setCopiedCmd(false), 2000)
    }

    return (
        <div className='flex flex-col h-[75vh] max-h-[820px] bg-white dark:bg-[#0c0d14] text-gray-800 dark:text-gray-100 select-none overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl'>
            {/* Safari Header Navigation */}
            <div id='window-header' className='flex items-center justify-between px-3.5 py-2 bg-gray-100 dark:bg-[#161724] border-b border-gray-200 dark:border-white/10 shrink-0'>
                <div className='flex items-center gap-2'>
                    <WindowControls target='safari' />

                    <div className='flex items-center gap-1 ml-4'>
                        <button
                            onClick={handleBackToList}
                            disabled={!selectedArticle}
                            className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition cursor-pointer'
                            title='Back to All Articles'
                        >
                            <ChevronLeft className='size-4' />
                        </button>
                        <button
                            disabled
                            className='p-1 rounded text-gray-400 opacity-30 cursor-default'
                        >
                            <ChevronRight className='size-4' />
                        </button>
                    </div>
                </div>

                {/* Smart Search & Address Bar */}
                <div className='flex-1 max-w-xl mx-4'>
                    <div className='flex items-center gap-2 bg-white dark:bg-[#0e0f18] border border-gray-300 dark:border-white/15 rounded-lg px-3 py-1.5 shadow-inner'>
                        <ShieldHalf className='size-3.5 text-emerald-500 shrink-0' />
                        <input
                            type='text'
                            value={selectedArticle ? urlBar : searchQuery}
                            onChange={(e) => {
                                if (selectedArticle) {
                                    setUrlBar(e.target.value)
                                } else {
                                    setSearchQuery(e.target.value)
                                }
                            }}
                            placeholder='Search 15 production architecture articles (lakehouse, rust, agent, security)...'
                            className='flex-1 bg-transparent border-none outline-none text-xs text-gray-800 dark:text-white placeholder-gray-400'
                        />
                        <SearchIcon className='size-3.5 text-gray-400 shrink-0' />
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: selectedArticle?.title || 'Kishor Articles', url: window.location.href })
                            }
                        }}
                        className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition cursor-pointer'
                        title='Share'
                    >
                        <Share className='size-3.5' />
                    </button>
                    {selectedArticle?.repoUrl && (
                        <a
                            href={selectedArticle.repoUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition cursor-pointer shadow-xs'
                            title='View Code on GitHub'
                        >
                            <span>GitHub</span>
                            <ExternalLink className='size-3' />
                        </a>
                    )}
                </div>
            </div>

            {/* Safari Body Content */}
            <div className='flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0a0a0f] p-4 sm:p-6'>
                {!selectedArticle ? (
                    /* Articles Directory View (All 15 Projects) */
                    <div className='max-w-4xl mx-auto'>
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-200 dark:border-white/10 gap-2'>
                            <div>
                                <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                    <BookOpen className='size-5 text-blue-500' />
                                    <span>Production Architectural Deep-Dives (15 Flagship Systems)</span>
                                </h1>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                    Enterprise Systems Design, Medallion Lakehouses, LLMOps & Bare-Metal Engineering by Kishor Kumar Paroi
                                </p>
                            </div>
                            <span className='px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-xs font-semibold shrink-0'>
                                {filteredArticles.length} of 15 Articles
                            </span>
                        </div>

                        {/* Articles Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {filteredArticles.map((article) => (
                                <div
                                    key={article.id}
                                    onClick={() => handleSelectArticle(article)}
                                    className='flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-[#13141f] border border-gray-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-400 shadow-xs hover:shadow-md transition duration-200 cursor-pointer group'
                                >
                                    <div>
                                        <div className='flex items-center justify-between text-[10px] font-mono mb-2'>
                                            <span className='px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 font-bold'>
                                                {article.category}
                                            </span>
                                            <span className='text-gray-400'>{article.readTime}</span>
                                        </div>

                                        <h3 className='font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug'>
                                            {article.title}
                                        </h3>

                                        <p className='text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-3 leading-relaxed'>
                                            {article.overview}
                                        </p>
                                    </div>

                                    <div className='mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] font-medium text-blue-600 dark:text-cyan-400'>
                                        <span>Read Full Architecture →</span>
                                        <span className='text-gray-400 text-[10px] font-mono'>{article.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* In-Depth Article Reader Mode */
                    <article className='max-w-3xl mx-auto py-2'>
                        <button
                            onClick={handleBackToList}
                            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-xs font-semibold text-gray-700 dark:text-gray-200 transition cursor-pointer mb-6'
                        >
                            <ArrowLeft className='size-3.5' />
                            <span>Back to All 15 Articles</span>
                        </button>

                        <div className='flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 mb-2'>
                            <span className='px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'>
                                {selectedArticle.category}
                            </span>
                            <span>•</span>
                            <span className='flex items-center gap-1'>
                                <Clock className='size-3' />
                                <span>{selectedArticle.readTime}</span>
                            </span>
                            <span>•</span>
                            <span>{selectedArticle.date}</span>
                        </div>

                        <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4'>
                            {selectedArticle.title}
                        </h1>

                        <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-sans mb-6'>
                            {selectedArticle.overview}
                        </p>

                        {/* Architecture Diagram */}
                        {selectedArticle.image && (
                            <div className='mb-8 rounded-xl overflow-hidden border border-gray-200 dark:border-white/15 bg-black/60 shadow-lg'>
                                <div className='p-2 bg-gray-100 dark:bg-black/80 border-b border-gray-200 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-500 dark:text-gray-400'>
                                    <span>System Architecture Topology</span>
                                    <a
                                        href={selectedArticle.image}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-1 text-cyan-400 hover:underline'
                                    >
                                        <span>Full Res</span>
                                        <ExternalLink className='size-3' />
                                    </a>
                                </div>
                                <div className='p-3 flex items-center justify-center bg-black'>
                                    <img
                                        src={selectedArticle.image}
                                        alt={selectedArticle.title}
                                        className='max-h-80 w-auto object-contain rounded'
                                        onError={(e) => {
                                            e.currentTarget.onerror = null
                                            e.currentTarget.src = '/images/macbook-wallpaper-sonoma-horizon.jpg'
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Quantified Production Metrics Grid */}
                        {selectedArticle.metrics && (
                            <div className='mb-8'>
                                <h2 className='text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3'>
                                    Empirical Production Impact &amp; Metrics
                                </h2>
                                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5'>
                                    {selectedArticle.metrics.map((m, i) => (
                                        <div key={i} className='p-3 rounded-xl bg-white dark:bg-[#13141f] border border-gray-200 dark:border-white/10'>
                                            <p className='text-[10px] text-gray-500 dark:text-gray-400 font-mono'>{m.label}</p>
                                            <p className='text-sm sm:text-base font-extrabold text-blue-600 dark:text-cyan-300 mt-0.5'>{m.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Architectural Pillars */}
                        {selectedArticle.architecture && (
                            <div className='mb-8'>
                                <h2 className='text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3'>
                                    Key Architectural Components
                                </h2>
                                <ul className='space-y-2.5'>
                                    {selectedArticle.architecture.map((pillar, i) => (
                                        <li key={i} className='p-3 rounded-xl bg-white dark:bg-[#13141f] border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-2.5'>
                                            <span className='size-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0' />
                                            <span>{pillar}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Trade-off Analysis Matrix */}
                        {selectedArticle.tradeoffs && selectedArticle.tradeoffs.length > 0 && (
                            <div className='mb-8'>
                                <h2 className='text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3'>
                                    Principal Architecture Trade-off Analysis
                                </h2>
                                <div className='space-y-2'>
                                    {selectedArticle.tradeoffs.map((t, i) => (
                                        <div key={i} className='p-3 rounded-xl bg-white dark:bg-[#13141f] border border-gray-200 dark:border-white/10 text-xs'>
                                            <p className='font-bold text-gray-900 dark:text-white mb-1'>⚖️ {t.decision}</p>
                                            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.rationale}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Single-Command Deploy Runbook */}
                        {selectedArticle.deployCmd && (
                            <div className='mb-8 p-4 rounded-xl bg-black/80 border border-cyan-500/30 text-xs font-mono'>
                                <div className='flex items-center justify-between mb-2 text-cyan-300 font-bold'>
                                    <div className='flex items-center gap-1.5'>
                                        <Terminal className='size-4' />
                                        <span>One-Click Verification / Deploy Command</span>
                                    </div>
                                    <button
                                        onClick={() => copyDeployCommand(selectedArticle.deployCmd)}
                                        className='flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 transition cursor-pointer text-[10px]'
                                    >
                                        {copiedCmd ? <Check className='size-3 text-emerald-400' /> : <Copy className='size-3' />}
                                        <span>{copiedCmd ? 'Copied' : 'Copy Command'}</span>
                                    </button>
                                </div>
                                <code className='text-amber-300 break-all select-all'>
                                    {selectedArticle.deployCmd}
                                </code>
                            </div>
                        )}

                        {/* Footer Action Links */}
                        <div className='pt-6 border-t border-gray-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs'>
                            <button
                                onClick={handleBackToList}
                                className='px-4 py-2 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 font-semibold text-gray-800 dark:text-white transition cursor-pointer'
                            >
                                ← Back to All Articles
                            </button>
                            <div className='flex items-center gap-2'>
                                {selectedArticle.liveUrl && (
                                    <a
                                        href={selectedArticle.liveUrl}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-1.5 shadow-sm'
                                    >
                                        <span>Live Experience</span>
                                        <ExternalLink className='size-3.5' />
                                    </a>
                                )}
                                {selectedArticle.repoUrl && (
                                    <a
                                        href={selectedArticle.repoUrl}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 shadow-sm'
                                    >
                                        <span>GitHub Repository</span>
                                        <ExternalLink className='size-3.5' />
                                    </a>
                                )}
                            </div>
                        </div>
                    </article>
                )}
            </div>
        </div>
    )
}

const SafariWindow = WindowWrapper(Safari, 'safari')

export default SafariWindow