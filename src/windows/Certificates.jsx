import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import {
    Award,
    ExternalLink,
    FileText,
    Search,
    ShieldCheck,
    Clock,
    Sparkles,
    Check,
    Copy
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

const CATEGORIES = [
    'ALL',
    'TOP10',
    'Agentic AI & MCP',
    'MLOps & LLMOps',
    'Data & Lakehouse',
    'Cloud & DevOps',
    'Systems & Algorithms',
    'GenAI & Vision',
]

const Certificates = ({ isMaximized }) => {
    const [certs, setCerts] = useState([])
    const [totalHours, setTotalHours] = useState(1172.5)
    const [category, setCategory] = useState('ALL')
    const [query, setQuery] = useState('')
    const [copiedId, setCopiedId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/certs.json')
            .then((r) => r.json())
            .then((data) => {
                setCerts(data.certificates || [])
                if (data.totalHours) setTotalHours(data.totalHours)
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const handleCopy = (id) => {
        navigator.clipboard?.writeText(id)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 1500)
    }

    const filtered = certs.filter((cert) => {
        if (category === 'TOP10' && !cert.topRank) return false
        if (category !== 'ALL' && category !== 'TOP10' && cert.category !== category) return false

        const q = query.trim().toLowerCase()
        if (!q) return true
        return [
            cert.title,
            cert.instructors,
            cert.category,
            cert.credentialId,
            cert.summary,
            ...(cert.tags || []),
        ]
            .join(' ')
            .toLowerCase()
            .includes(q)
    })

    return (
        <div
            className={`flex flex-col bg-white dark:bg-[#0b0d16] text-gray-800 dark:text-gray-100 select-none overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl ${
                isMaximized ? 'h-[calc(100vh-92px)] w-full rounded-none' : 'h-[76vh] max-h-[820px]'
            }`}
        >
            {/* Header */}
            <div
                id='window-header'
                className='flex items-center justify-between px-3.5 py-2.5 bg-gray-100 dark:bg-[#141726] border-b border-gray-200 dark:border-white/10 shrink-0'
            >
                <div className='flex items-center gap-2 min-w-0'>
                    <WindowControls target='certificates' />
                    <div className='flex items-center gap-2 ml-3 truncate'>
                        <Award className='size-4 text-amber-500 shrink-0' />
                        <span className='text-xs font-semibold tracking-wide truncate'>
                            Verified Certificates Vault ({certs.length || 34} Credentials &bull; {totalHours}h)
                        </span>
                    </div>
                </div>

                <a
                    href='https://certificate.kishor.tech'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black rounded-md transition shadow-xs shrink-0'
                    title='Open certificate.kishor.tech in new tab'
                >
                    <span>certificate.kishor.tech</span>
                    <ExternalLink size={11} />
                </a>
            </div>

            {/* Filter + Search Bar */}
            <div className='p-3 bg-gray-50 dark:bg-[#101320] border-b border-gray-200 dark:border-white/10 space-y-2.5 shrink-0'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                    <div className='relative flex-1 min-w-[220px]'>
                        <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400' />
                        <input
                            type='text'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder='Search 34 certificates, instructors, UC-id, MCP, Iceberg...'
                            className='w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#070912] border border-gray-300 dark:border-white/15 rounded-lg text-xs outline-none focus:border-cyan-500'
                        />
                    </div>
                    <div className='text-[11px] font-mono text-gray-500 dark:text-cyan-300 font-semibold'>
                        Showing {filtered.length} / {certs.length || 34} credentials
                    </div>
                </div>

                <div className='flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] no-scrollbar'>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type='button'
                            onClick={() => setCategory(cat)}
                            className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer whitespace-nowrap border ${
                                category === cat
                                    ? cat === 'TOP10'
                                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                                        : 'bg-cyan-500 text-black border-cyan-400 font-bold'
                                    : 'bg-white dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10'
                            }`}
                        >
                            {cat === 'ALL' ? `All (${certs.length || 34})` : cat === 'TOP10' ? '★ Top 10 Profile Picks' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {/* Hero Banner */}
                <div className='rounded-xl p-3.5 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3'>
                    <div className='flex items-center gap-2.5'>
                        <Sparkles className='size-4 text-cyan-400 shrink-0' />
                        <div className='text-xs'>
                            <strong className='text-gray-900 dark:text-white'>Audited Credential Archive:</strong>{' '}
                            <span className='text-gray-600 dark:text-gray-300'>
                                Click Inspect PDF to view original certificates on certificate.kishor.tech or verify live on Udemy.
                            </span>
                        </div>
                    </div>
                    <a
                        href='https://certificate.kishor.tech'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-300 hover:underline shrink-0'
                    >
                        Full Standalone Vault ↗
                    </a>
                </div>

                {loading ? (
                    <div className='text-center py-12 text-xs font-mono text-gray-400'>
                        Loading 34 verified credentials...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className='text-center py-12 text-xs font-mono text-gray-400'>
                        No certificates matched "{query}".
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3.5'>
                        {filtered.map((cert) => (
                            <article
                                key={cert.slug}
                                className={`p-4 rounded-xl border bg-gray-50/70 dark:bg-[#121626] flex flex-col justify-between gap-3 transition ${
                                    cert.topRank
                                        ? 'border-amber-500/40 dark:border-amber-400/40'
                                        : 'border-gray-200 dark:border-white/10'
                                }`}
                            >
                                <div>
                                    <div className='flex items-center justify-between gap-2 mb-2'>
                                        <span className='text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'>
                                            {cert.category}
                                        </span>
                                        {cert.topRank && (
                                            <span className='text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'>
                                                ★ PICK #{cert.topRank}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className='text-sm font-bold text-gray-900 dark:text-white leading-snug mb-1'>
                                        {cert.title}
                                    </h3>
                                    <p className='text-[11px] font-mono text-blue-600 dark:text-blue-300 mb-1.5'>
                                        Instructor: {cert.instructors}
                                    </p>
                                    <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                        {cert.summary}
                                    </p>
                                </div>

                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between text-[10px] font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-black/40 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10'>
                                        <span className='flex items-center gap-1'>
                                            <Clock className='size-3 text-cyan-500' /> {cert.hoursLabel}
                                        </span>
                                        <button
                                            type='button'
                                            onClick={() => handleCopy(cert.credentialId)}
                                            className='flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer truncate max-w-[170px]'
                                            title='Click to copy Credential ID'
                                        >
                                            {copiedId === cert.credentialId ? (
                                                <>
                                                    <Check className='size-3' />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className='size-2.5 shrink-0' />
                                                    <span className='truncate'>{cert.credentialId}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className='grid grid-cols-2 gap-2 text-[11px] font-mono font-bold'>
                                        <a
                                            href={`https://certificate.kishor.tech/?pdf=${cert.slug}`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='flex items-center justify-center gap-1 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-800 dark:text-cyan-200 transition'
                                        >
                                            <FileText className='size-3' />
                                            <span>Inspect PDF ↗</span>
                                        </a>
                                        <a
                                            href={cert.verifyUrl}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 transition'
                                        >
                                            <ShieldCheck className='size-3' />
                                            <span>Verify ↗</span>
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const CertificatesWindow = WindowWrapper(Certificates, 'certificates')
export default CertificatesWindow
