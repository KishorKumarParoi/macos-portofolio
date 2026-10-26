import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef, useState, useEffect } from 'react'
import { Sparkles, Star, Terminal, Cpu, ShieldCheck, Activity, Zap, Play, Pause, RefreshCw, ChevronRight, Binary, Volume2, VolumeX, Square, RotateCcw, FastForward, Music } from 'lucide-react'

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 },
}

const renderText = (text, className, basWeight = 400) => {
    return [...text].map((char, index) => (
        <span
            key={index}
            className={className}
            style={{ fontVariationSettings: `'wght' ${basWeight}` }}
        >
            {char === ' ' ? '\u00A0' : char}
        </span>
    ))
}

const setupTextHover = (container, type) => {
    if (!container) return
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return

    const letters = container.querySelectorAll('span')
    const { min, max, default: base } = FONT_WEIGHTS[type]

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, {
            duration,
            ease: 'power2.out',
            fontVariationSettings: `'wght' ${weight}`,
        })
    }

    const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect()
        const mouseX = e.clientX - left

        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect()
            const distance = Math.abs(mouseX - (l - left + w / 2))
            const intensity = Math.exp(-(distance ** 2) / 20000)

            animateLetter(letter, min + (max - min) * intensity)
        })
    }

    const handleMouseLeave = () => {
        letters.forEach((letter) => {
            animateLetter(letter, base)
        })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseleave', handleMouseLeave)
    }
}

// 🤖 Flagship Serial Robotic Hacker Telemetry Blocks
// Cycles serially through Kishor's real Principal Architect expertise & work experiences,
// displays with cybernetic green/cyan phosphor glow, and vanishes with a flashy de-rez glitch.
const HACKER_EXPERTISE_BLOCKS = [
    {
        id: '01',
        blockCode: '0x7F_LAKEHOUSE_CORE',
        phase: 'PHASE 01/05 // ARCHITECTURAL MASTERY',
        role: 'PRINCIPAL AI SYSTEMS ARCHITECT',
        org: 'KOOM-AI • MEDALLION LAKEHOUSE PLATFORM',
        metrics: '35M+ Orders (2.3GB) • $18K/mo Compute Savings (-42%) • <5ms Serving Latency',
        stack: 'PySpark Delta Lake • Snowflake SCD-2 • Kafka CDC WAL • Feast Feature Store',
        impact: 'Engineered multimodal CV dispute arbitration cutting fraudulent refund claims by 68% ($1.2M protected).',
        accentColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/40',
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',
        glowColor: 'rgba(16,185,129,0.25)',
    },
    {
        id: '02',
        blockCode: '0x8A_CDC_WAL_STREAM',
        phase: 'PHASE 02/05 // REAL-TIME EVENT STREAMING',
        role: 'DISTRIBUTED SYSTEMS & STREAMING ARCHITECT',
        org: 'HIGH-THROUGHPUT FRAUD & TRANSACTION ENGINE',
        metrics: '10M+ Daily Events • Exactly-Once CQRS Delivery • Redis Low-Latency Cluster',
        stack: 'Apache Airflow • Debezium CDC WAL • Redis Cache • FastAPI • Kubernetes GitOps',
        impact: 'Deployed distributed transactional outbox and zero-data-loss failover across multi-region clusters.',
        accentColor: 'text-cyan-400',
        borderColor: 'border-cyan-500/40',
        badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30',
        glowColor: 'rgba(6,182,212,0.25)',
    },
    {
        id: '03',
        blockCode: '0x9C_NEXUS_AGENT_MESH',
        phase: 'PHASE 03/05 // LLMOPS & MULTI-AGENT SWARMS',
        role: 'LLMOPS & AGENTIC SYSTEMS LEAD',
        org: 'NEXUS AI • ENTERPRISE MULTI-AGENT MESH',
        metrics: 'Hybrid RAG (Dense + BM25) • FlashRank ONNX Local Re-Rank • Semantic Cache <50ms',
        stack: 'NeMo Guardrails • BotShield Enterprise WAF • FastMCP • Cohere v3.5 • Presidio PII',
        impact: 'Deployed multi-turn agentic mesh with HITL break-glass governance and RAGAS automated CoT eval.',
        accentColor: 'text-purple-400',
        borderColor: 'border-purple-500/40',
        badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-400/30',
        glowColor: 'rgba(168,85,247,0.25)',
    },
    {
        id: '04',
        blockCode: '0xB4_RUET_CF_SPECIALIST',
        phase: 'PHASE 04/05 // MATHEMATICAL FOUNDATIONS',
        role: 'COMPETITIVE PROGRAMMING & ALGORITHM SPECIALIST',
        org: 'RUET B.SC. IN CSE • CODEFORCES SPECIALIST',
        metrics: 'Rank 483rd in Bangladesh (Admission) • Codeforces 232nd Blue Coder',
        stack: '1,500+ Algorithms Solved • Segment Trees • Dinic Max Flow • Disjoint Sets • DP',
        impact: 'Engineered lock-free concurrent memory buffers and sub-millisecond graph query optimizers.',
        accentColor: 'text-amber-400',
        borderColor: 'border-amber-500/40',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-400/30',
        glowColor: 'rgba(251,191,36,0.25)',
    },
    {
        id: '05',
        blockCode: '0xEF_OBSERVABILITY_GITOPS',
        phase: 'PHASE 05/05 // ENTERPRISE GOVERNANCE',
        role: 'PLATFORM GOVERNANCE & OBSERVABILITY ARCHITECT',
        org: 'ENTERPRISE GOLDEN PATHS & DEVOPS',
        metrics: '99.99% Availability SLO • Zero-Downtime Blue/Green Rollouts',
        stack: 'Prometheus • Grafana • OpenTelemetry Tracing • Terraform IaC • ArgoCD',
        impact: 'Architected automated drift detection, model rollback gates, and SOC 2 / ISO 27001 compliance.',
        accentColor: 'text-rose-400',
        borderColor: 'border-rose-500/40',
        badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-400/30',
        glowColor: 'rgba(244,63,94,0.25)',
    },
]

const Welcome = () => {
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)
    const canvasRef = useRef(null)
    
    // Visitor name greeting (synced with LockScreen login)
    const [visitorName, setVisitorName] = useState(() => {
        if (typeof window === 'undefined') return ''
        return sessionStorage.getItem('macos_visitor_name') || ''
    })

    // Serial Robotic Hacker Telemetry State
    const [blockIndex, setBlockIndex] = useState(0)
    const [isVanishing, setIsVanishing] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)

    // Arijit Singh "Asatoma Sadgamaya" Vedic Audio State
    const slokaAudioRef = useRef(null)
    const [slokaPlaying, setSlokaPlaying] = useState(false)
    const [slokaMuted, setSlokaMuted] = useState(false)
    const [slokaVanished, setSlokaVanished] = useState(false)

    useEffect(() => {
        const audio = new Audio('/audio/asato_ma_sadgamaya.mp3')
        audio.preload = 'auto'
        audio.volume = 0.5
        slokaAudioRef.current = audio

        const handleEnded = () => {
            setSlokaPlaying(false)
            setSlokaVanished(true)
        }

        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.pause()
            audio.removeEventListener('ended', handleEnded)
            slokaAudioRef.current = null
        }
    }, [])

    const handleSlokaHover = () => {
        if (slokaVanished) return
        if (slokaAudioRef.current && !slokaPlaying) {
            slokaAudioRef.current.play()
                .then(() => setSlokaPlaying(true))
                .catch((e) => console.log('Autoplay caught:', e))
        }
    }

    const toggleSlokaPlay = (e) => {
        e?.stopPropagation()
        if (!slokaAudioRef.current) return
        if (slokaPlaying) {
            slokaAudioRef.current.pause()
            setSlokaPlaying(false)
        } else {
            slokaAudioRef.current.play().then(() => setSlokaPlaying(true)).catch(console.error)
        }
    }

    const stopSlokaAudio = (e) => {
        e?.stopPropagation()
        if (!slokaAudioRef.current) return
        slokaAudioRef.current.pause()
        slokaAudioRef.current.currentTime = 0
        setSlokaPlaying(false)
    }

    const toggleSlokaMute = (e) => {
        e?.stopPropagation()
        if (!slokaAudioRef.current) return
        const nextMute = !slokaMuted
        slokaAudioRef.current.muted = nextMute
        setSlokaMuted(nextMute)
    }

    useEffect(() => {
        const handleUnlock = (e) => {
            if (e?.detail?.name && e.detail.name !== 'Guest Explorer') {
                setVisitorName(e.detail.name)
            }
        }
        window.addEventListener('macos-unlocked', handleUnlock)
        return () => window.removeEventListener('macos-unlocked', handleUnlock)
    }, [])

    useGSAP(() => {
        const subTitleCleanUp = setupTextHover(subtitleRef.current, 'subtitle')
        const titleCleanUp = setupTextHover(titleRef.current, 'title')

        return () => {
            subTitleCleanUp && subTitleCleanUp()
            titleCleanUp && titleCleanUp()
        }
    })

    // Serial Telemetry Rotating & Vanishing Engine
    // Displays each experience for 4 seconds, triggers robotic vanish transition (500ms), then cycles to next
    useEffect(() => {
        if (isPaused || isMinimized) return

        const displayDuration = 4200
        const vanishDuration = 600

        const vanishTimeout = setTimeout(() => {
            setIsVanishing(true)
        }, displayDuration)

        const cycleTimeout = setTimeout(() => {
            setBlockIndex((prev) => (prev + 1) % HACKER_EXPERTISE_BLOCKS.length)
            setIsVanishing(false)
        }, displayDuration + vanishDuration)

        return () => {
            clearTimeout(vanishTimeout)
            clearTimeout(cycleTimeout)
        }
    }, [blockIndex, isPaused, isMinimized])

    // Cosmic Interactive Twinkling & Shooting Starfield Canvas
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // 120 Twinkling Stars
        const stars = Array.from({ length: 120 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 1.8 + 0.4,
            alpha: Math.random() * 0.8 + 0.2,
            speed: Math.random() * 0.02 + 0.005,
            color: ['#ffffff', '#fde047', '#38bdf8', '#f472b6', '#fed7aa'][Math.floor(Math.random() * 5)],
        }))

        // Shooting Stars (Meteors)
        const meteors = []
        const spawnMeteor = () => {
            if (meteors.length >= 4) return
            meteors.push({
                x: Math.random() * (canvas.width * 0.7),
                y: Math.random() * (canvas.height * 0.4),
                length: Math.random() * 90 + 50,
                speed: Math.random() * 10 + 14,
                angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
                opacity: 1,
                color: ['#38bdf8', '#fde047', '#f472b6', '#fed7aa'][Math.floor(Math.random() * 4)],
            })
        }
        const meteorInterval = setInterval(spawnMeteor, 2200)

        // Burst Particles
        const burstParticles = []
        const handleClick = (e) => {
            for (let i = 0; i < 18; i++) {
                const angle = (Math.PI * 2 * i) / 18
                const speed = Math.random() * 3 + 2
                burstParticles.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    radius: Math.random() * 2 + 1,
                    alpha: 1,
                    color: ['#38bdf8', '#fde047', '#f472b6', '#ffffff'][Math.floor(Math.random() * 4)],
                })
            }
        }
        window.addEventListener('click', handleClick)

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw Twinkling Stars
            stars.forEach((s) => {
                s.alpha += s.speed
                if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed
                ctx.save()
                ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha))
                ctx.fillStyle = s.color
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
                ctx.fill()
                ctx.restore()
            })

            // Draw Shooting Stars
            for (let i = meteors.length - 1; i >= 0; i--) {
                const m = meteors[i]
                ctx.save()
                ctx.globalAlpha = m.opacity
                ctx.strokeStyle = m.color
                ctx.lineWidth = 1.8
                ctx.shadowBlur = 8
                ctx.shadowColor = m.color
                const endX = m.x - Math.cos(m.angle) * m.length
                const endY = m.y - Math.sin(m.angle) * m.length
                ctx.beginPath()
                ctx.moveTo(m.x, m.y)
                ctx.lineTo(endX, endY)
                ctx.stroke()
                ctx.restore()

                m.x += Math.cos(m.angle) * m.speed
                m.y += Math.sin(m.angle) * m.speed
                m.opacity -= 0.015

                if (m.opacity <= 0 || m.x > canvas.width || m.y > canvas.height) {
                    meteors.splice(i, 1)
                }
            }

            // Draw Burst Particles
            for (let i = burstParticles.length - 1; i >= 0; i--) {
                const p = burstParticles[i]
                ctx.save()
                ctx.globalAlpha = p.alpha
                ctx.fillStyle = p.color
                ctx.shadowBlur = 6
                ctx.shadowColor = p.color
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
                ctx.fill()
                ctx.restore()

                p.x += p.vx
                p.y += p.vy
                p.alpha -= 0.02
                if (p.alpha <= 0) {
                    burstParticles.splice(i, 1)
                }
            }

            animId = requestAnimationFrame(render)
        }
        render()

        return () => {
            cancelAnimationFrame(animId)
            clearInterval(meteorInterval)
            window.removeEventListener('resize', resize)
            window.removeEventListener('click', handleClick)
        }
    }, [])

    const greetingText = visitorName && visitorName !== 'Guest Explorer'
        ? `Namaste, ${visitorName}! I'm Kishor`
        : "Namaste, I'm Kishor"

    const currentBlock = HACKER_EXPERTISE_BLOCKS[blockIndex]

    return (
        <section id='welcome' className='relative z-1 pointer-events-none'>
            {/* Background Interactive Starfield Canvas */}
            <canvas
                ref={canvasRef}
                className='fixed inset-0 pointer-events-auto z-0 opacity-80'
            />

            {/* Glowing Nebula Backdrop Behind Namaste */}
            <div className='absolute -top-16 left-1/2 -translate-x-1/2 w-[520px] h-48 bg-gradient-to-r from-amber-500/20 via-pink-500/15 to-cyan-500/20 blur-3xl rounded-full pointer-events-none animate-pulse' />

            {/* Vedic Sanskrit Sloka Pill with Arijit Singh "Asatoma Sadgamaya" Music & Vanish */}
            {!slokaVanished ? (
                <div 
                    onMouseEnter={handleSlokaHover}
                    className='relative z-10 mb-3 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 border border-amber-400/40 backdrop-blur-md shadow-xl pointer-events-auto hover:border-amber-400/80 transition duration-300 cursor-pointer group'
                    title='Hover to play Arijit Singh — "Osoto ma sadgamaya" • Sloka vanishes when song completes'
                >
                    <span className={`size-2 rounded-full ${slokaPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                    <span className='text-[11px] font-mono font-bold tracking-widest uppercase bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 bg-clip-text text-transparent flex items-center gap-1.5'>
                        <span>🙏 ॐ असतो मा सद्गमय (Arijit Singh)</span>
                    </span>
                    
                    {/* Audio Controls: Play/Pause, Stop, Mute, Fast Forward */}
                    <div className='flex items-center gap-1 ml-1 pl-1.5 border-l border-white/20' onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={toggleSlokaPlay}
                            className='p-1 rounded hover:bg-white/20 text-amber-300 transition cursor-pointer'
                            title={slokaPlaying ? 'Pause' : 'Play Song'}
                        >
                            {slokaPlaying ? <Pause className='size-3 text-emerald-400' /> : <Play className='size-3' />}
                        </button>
                        <button
                            onClick={stopSlokaAudio}
                            className='p-1 rounded hover:bg-white/20 text-red-400 transition cursor-pointer'
                            title='Stop Song'
                        >
                            <Square className='size-2.5 fill-current' />
                        </button>
                        <button
                            onClick={toggleSlokaMute}
                            className='p-1 rounded hover:bg-white/20 text-gray-300 transition cursor-pointer'
                            title={slokaMuted ? 'Unmute' : 'Mute'}
                        >
                            {slokaMuted ? <VolumeX className='size-3 text-red-400' /> : <Volume2 className='size-3 text-cyan-300' />}
                        </button>
                        <button
                            onClick={() => {
                                if (slokaAudioRef.current?.duration) {
                                    slokaAudioRef.current.currentTime = Math.max(0, slokaAudioRef.current.duration - 2)
                                    if (!slokaPlaying) slokaAudioRef.current.play().then(() => setSlokaPlaying(true))
                                }
                            }}
                            className='p-1 rounded hover:bg-white/20 text-amber-300/80 transition cursor-pointer'
                            title='Test Vanish (Fast Forward to End)'
                        >
                            <FastForward className='size-2.5' />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => {
                        setSlokaVanished(false)
                        if (slokaAudioRef.current) slokaAudioRef.current.currentTime = 0
                    }}
                    className='relative z-10 mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 border border-amber-400/30 text-amber-300 text-[10px] font-mono shadow-md hover:border-amber-400 transition cursor-pointer pointer-events-auto'
                >
                    <RotateCcw className='size-2.5' />
                    <span>ॐ शान्तिः (Mantra Completed) • Click to Re-summon Sloka</span>
                </button>
            )}

            {/* Sparkling Shimmering Namaste Text with Character Hover */}
            <div className='relative z-10 flex items-center justify-center gap-2.5 pointer-events-auto'>
                <Sparkles className='size-5 text-amber-300 animate-bounce hidden sm:block' />
                <p 
                    ref={subtitleRef} 
                    className='text-3xl sm:text-4xl font-georama font-black tracking-tight text-center drop-shadow-[0_0_25px_rgba(251,191,36,0.55)] bg-gradient-to-r from-amber-200 via-yellow-400 via-rose-300 via-cyan-300 to-amber-200 bg-clip-text text-transparent'
                >
                    {renderText(greetingText, 'font-georama', 200)}
                </p>
                <Sparkles className='size-5 text-cyan-300 animate-bounce hidden sm:block delay-300' />
            </div>

            {/* Improvised Robotic Hacker Security & Neural Link Status */}
            <div className='relative z-10 mt-1.5 flex items-center justify-center gap-2 font-mono text-[10px] sm:text-[11px] text-cyan-300/90 pointer-events-auto select-none'>
                <span className='inline-block size-1.5 rounded-full bg-emerald-400 animate-pulse' />
                <span className='tracking-wider uppercase text-gray-300'>
                    {visitorName && visitorName !== 'Guest Explorer'
                        ? `AUTH://USER_${visitorName.replace(/\s+/g, '_').toUpperCase()} • SECURITY_LEVEL_01_CLEARANCE`
                        : 'AUTH://EXPLORER_GUEST • 64-BIT NEURAL SILICON RUNTIME'}
                </span>
                <span className='text-gray-500'>|</span>
                <span className='text-emerald-400 font-semibold'>SYSTEM_OK</span>
            </div>

            {/* Portfolio Master Title */}
            <h1 
                ref={titleRef} 
                className='relative z-10 mt-2 sm:mt-3 text-5xl sm:text-8xl md:text-9xl italic font-georama font-extrabold text-white/90 drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] tracking-tight pointer-events-auto'
            >
                {renderText('portfolio', 'font-georama')}
            </h1>

            {/* Subtitle Credentials Badge */}
            <p className='relative z-10 mt-3 text-[10px] sm:text-sm font-mono text-gray-300/90 bg-black/45 backdrop-blur-md border border-white/15 px-3 sm:px-4 py-1.5 rounded-full shadow-xl pointer-events-auto flex items-center justify-center gap-1.5 sm:gap-2 max-w-[92vw] text-center'>
                <Star className='size-3 text-amber-400 fill-amber-400 shrink-0' />
                <span className='truncate sm:whitespace-normal'>Principal AI Systems Architect • Medallion Lakehouses &amp; LLMOps • Founder @ Koom-AI</span>
            </p>

            {/* 🤖 Robotic Hacker Style Serial Expertise & Work Experience Telemetry Terminal */}
            {/* Cycles serially through Kishor's Principal Architect experience, stays for 4s, and vanishes with a flashy de-rez glitch */}
            <div className='relative z-10 mt-4 max-w-xl w-[92vw] sm:w-full pointer-events-auto select-none'>
                {!isMinimized ? (
                    <div
                        className={`relative rounded-2xl bg-black/85 backdrop-blur-2xl border transition-all duration-500 overflow-hidden shadow-2xl p-3.5 sm:p-4 text-left ${
                            currentBlock.borderColor
                        } ${
                            isVanishing
                                ? 'opacity-0 scale-95 blur-md translate-y-2'
                                : 'opacity-100 scale-100 blur-0 translate-y-0'
                        }`}
                        style={{
                            boxShadow: `0 0 35px ${currentBlock.glowColor}`,
                        }}
                    >
                        {/* Terminal Header Bar */}
                        <div className='flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-mono'>
                            <div className='flex items-center gap-2'>
                                <div className='flex items-center gap-1.5'>
                                    <span className='size-2.5 rounded-full bg-red-500/80 inline-block' />
                                    <span className='size-2.5 rounded-full bg-yellow-500/80 inline-block' />
                                    <span className='size-2.5 rounded-full bg-emerald-500/80 inline-block' />
                                </div>
                                <span className='text-[10px] text-gray-400 ml-1 font-semibold flex items-center gap-1'>
                                    <Terminal className='size-3 text-cyan-400' />
                                    <span>paroi@koom-ai:~/telemetry</span>
                                </span>
                            </div>

                            <div className='flex items-center gap-2 text-[10px] font-mono'>
                                <span className='text-emerald-400 flex items-center gap-1 font-semibold'>
                                    <span className='size-1.5 rounded-full bg-emerald-400 animate-ping' />
                                    <span>STREAM [{currentBlock.id}/05]</span>
                                </span>
                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className='p-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer'
                                    title={isPaused ? 'Resume Serial Stream' : 'Pause Telemetry'}
                                >
                                    {isPaused ? <Play className='size-2.5 text-emerald-400' /> : <Pause className='size-2.5' />}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsVanishing(true)
                                        setTimeout(() => {
                                            setBlockIndex((prev) => (prev + 1) % HACKER_EXPERTISE_BLOCKS.length)
                                            setIsVanishing(false)
                                        }, 300)
                                    }}
                                    className='p-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer'
                                    title='Cycle to Next Block'
                                >
                                    <ChevronRight className='size-2.5 text-cyan-300' />
                                </button>
                            </div>
                        </div>

                        {/* Phase & Block Header */}
                        <div className='flex items-center justify-between text-[10px] font-mono mb-1.5'>
                            <span className='text-gray-400 tracking-wider'>{currentBlock.phase}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest ${currentBlock.badgeBg}`}>
                                {currentBlock.blockCode}
                            </span>
                        </div>

                        {/* Role Title */}
                        <h3 className={`text-xs sm:text-sm font-bold font-mono tracking-tight mb-0.5 ${currentBlock.accentColor}`}>
                            {currentBlock.role}
                        </h3>
                        <p className='text-[11px] font-mono text-gray-300 font-semibold mb-2'>
                            {currentBlock.org}
                        </p>

                        {/* Impact Metrics Banner */}
                        <div className='bg-white/5 border border-white/10 rounded-lg p-2 mb-2'>
                            <div className='text-[10px] text-gray-400 font-mono uppercase tracking-wider mb-0.5 flex items-center gap-1'>
                                <Activity className='size-2.5 text-cyan-400' />
                                <span>Verified Production Impact:</span>
                            </div>
                            <p className='text-[11px] font-mono text-amber-300 font-medium leading-relaxed'>
                                {currentBlock.metrics}
                            </p>
                        </div>

                        {/* Tech Stack Specs */}
                        <div className='text-[10px] font-mono text-gray-400 mb-2 leading-relaxed'>
                            <span className='text-gray-500 uppercase'>Architecture: </span>
                            <span className='text-gray-300'>{currentBlock.stack}</span>
                        </div>

                        {/* Real Work Experience Achievement */}
                        <p className='text-[10px] font-mono text-gray-300 border-l-2 border-emerald-400/60 pl-2 leading-relaxed italic'>
                            {currentBlock.impact}
                        </p>

                        {/* Hacker Scanline Telemetry Footer */}
                        <div className='mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-400'>
                            <div className='flex items-center gap-1.5'>
                                <span className='size-1.5 rounded-full bg-cyan-400 animate-ping' />
                                <span>CYBERNETIC TELEMETRY STREAMING • VANISHES IN 4s</span>
                            </div>
                            <span className='text-cyan-300/80 font-semibold'>STATUS: ONLINE</span>
                        </div>
                    </div>
                ) : (
                    /* Minimized Hologram Status Chip */
                    <button
                        onClick={() => setIsMinimized(false)}
                        className='mx-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-emerald-500/40 backdrop-blur-md text-emerald-400 text-xs font-mono shadow-lg hover:border-emerald-400 transition cursor-pointer'
                    >
                        <Terminal className='size-3 animate-pulse' />
                        <span>Re-expand Robotic Hacker Telemetry [{blockIndex + 1}/05]</span>
                    </button>
                )}
            </div>
        </section>
    )
}

export default Welcome