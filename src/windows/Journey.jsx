import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { AI_ENGINEERING_JOURNEY } from '../constants/journey'
import {
    GraduationCap,
    ExternalLink,
    Search,
    BookOpen,
    Layers,
    Code,
    Sparkles,
    CheckCircle2,
    Copy,
    Check
} from 'lucide-react'
import React, { useState } from 'react'

const Journey = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedPhase, setSelectedPhase] = useState('all')
    const [copiedCode, setCopiedCode] = useState(null)

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const filteredPhases = AI_ENGINEERING_JOURNEY.phases
        .filter((phase) => selectedPhase === 'all' || phase.phase.includes(selectedPhase))
        .map((phase) => {
            if (!searchQuery.trim()) return phase
            const q = searchQuery.toLowerCase()
            const filteredMods = phase.modules.filter(
                (m) => m.code.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)
            )
            return { ...phase, modules: filteredMods }
        })
        .filter((phase) => phase.modules.length > 0)

    const totalModulesCount = AI_ENGINEERING_JOURNEY.phases.reduce((acc, p) => acc + p.modules.length, 0)

    return (
        <div className='flex flex-col h-[78vh] max-h-[860px] bg-white dark:bg-[#0c0d14] text-gray-800 dark:text-gray-100 select-none overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl'>
            {/* Header / Window Controls */}
            <div id='window-header' className='flex items-center justify-between px-3.5 py-2.5 bg-gray-100 dark:bg-[#161724] border-b border-gray-200 dark:border-white/10 shrink-0'>
                <div className='flex items-center gap-2'>
                    <WindowControls target='journey' />
                    <div className='flex items-center gap-2 ml-3'>
                        <GraduationCap className='size-4 text-emerald-600 dark:text-emerald-400' />
                        <span className='text-xs font-semibold tracking-wide'>
                            AI Engineering Learning Journey (38 Modules + Enterprise Systems)
                        </span>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <a
                        href={AI_ENGINEERING_JOURNEY.repoUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition shadow-xs cursor-pointer'
                        title='Open AI-Engineering on GitHub'
                    >
                        <span>GitHub Repo</span>
                        <ExternalLink size={11} />
                    </a>
                </div>
            </div>

            {/* Filter Bar & Search */}
            <div className='p-3 bg-gray-50 dark:bg-[#10111d] border-b border-gray-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0'>
                <div className='flex items-center gap-1.5 overflow-x-auto text-[11px]'>
                    {[
                        { id: 'all', label: 'All Phases' },
                        { id: 'Phase I', label: 'Phase I: Foundations' },
                        { id: 'Phase II', label: 'Phase II: Agents' },
                        { id: 'Phase III', label: 'Phase III: Eval & LoRA' },
                        { id: 'Phase IV', label: 'Phase IV: MLOps' },
                        { id: 'Phase V', label: 'Phase V: Platform & HITL' },
                        { id: 'Enterprise', label: 'Flagship Systems' },
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setSelectedPhase(btn.id)}
                            className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
                                selectedPhase === btn.id
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xs'
                                    : 'bg-gray-200/60 dark:bg-white/5 hover:bg-gray-200 text-gray-600 dark:text-gray-300'
                            }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                <div className='relative w-full sm:w-64'>
                    <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400' />
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Search 38 modules & topics...'
                        className='w-full pl-8 pr-3 py-1 bg-white dark:bg-[#090a0f] border border-gray-300 dark:border-white/10 rounded-md text-xs outline-none focus:border-emerald-500'
                    />
                </div>
            </div>

            {/* Scrollable Content Body */}
            <div className='flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-white/[0.01]'>
                {/* Hero Curriculum Description */}
                <div className='bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                    <div className='space-y-1'>
                        <h3 className='text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2'>
                            <Sparkles className='size-4 text-emerald-500' />
                            Codified Master Engineering Curriculum
                        </h3>
                        <p className='text-xs text-gray-600 dark:text-gray-400 max-w-2xl'>
                            {AI_ENGINEERING_JOURNEY.description}
                        </p>
                    </div>
                    <div className='text-right shrink-0'>
                        <div className='text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400'>
                            {totalModulesCount} Production Nodes
                        </div>
                        <div className='text-[10px] text-gray-400'>Phases I to V + 13 Flagships</div>
                    </div>
                </div>

                {/* Phase Cards Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    {filteredPhases.map((phase, pIdx) => (
                        <div
                            key={pIdx}
                            className={`rounded-xl border bg-gradient-to-br ${phase.color} p-4 sm:p-5 flex flex-col justify-between shadow-xs transition hover:shadow-md`}
                        >
                            <div>
                                <div className='flex items-center justify-between gap-2 border-b border-gray-200/50 dark:border-white/10 pb-2.5 mb-3'>
                                    <div>
                                        <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5'>
                                            <Layers className={`size-3.5 ${phase.accent}`} />
                                            {phase.phase}
                                        </h4>
                                        <div className='text-[10px] text-gray-500 dark:text-gray-400 mt-0.5'>
                                            {phase.tag}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border border-current ${phase.accent}`}>
                                        {phase.badge}
                                    </span>
                                </div>

                                <ul className='space-y-2 mt-2'>
                                    {phase.modules.map((mod, mIdx) => (
                                        <li
                                            key={mIdx}
                                            className='group flex items-start justify-between gap-2 text-xs p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition'
                                        >
                                            <div className='flex items-start gap-2 min-w-0'>
                                                <code className='text-[11px] font-mono font-semibold text-gray-800 dark:text-gray-200 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded shrink-0'>
                                                    {mod.code}
                                                </code>
                                                <span className='text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed'>
                                                    {mod.desc}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleCopy(mod.code)}
                                                className='opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white transition shrink-0'
                                                title='Copy module name'
                                            >
                                                {copiedCode === mod.code ? (
                                                    <Check className='size-3 text-emerald-500' />
                                                ) : (
                                                    <Copy className='size-3' />
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const JourneyWindow = WindowWrapper(Journey, 'journey')

export default JourneyWindow
