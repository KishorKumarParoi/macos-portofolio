import React, { useState, useEffect, useRef } from 'react'
import { ArrowRight, Lock, Unlock, Moon, RotateCcw, Power, User, Wifi, Battery, Volume2, Sparkles } from 'lucide-react'
import gsap from 'gsap'

// Synthesize authentic Apple-like glass unlock chime via Web Audio API
const playUnlockChime = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (!AudioCtx) return
        const ctx = new AudioCtx()
        
        // Play dual bell harmonic chord (E5 & B5)
        const notes = [659.25, 987.77]
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, ctx.currentTime)
            gain.gain.setValueAtTime(0.12, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6 + i * 0.1)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(ctx.currentTime + i * 0.05)
            osc.stop(ctx.currentTime + 0.7 + i * 0.1)
        })
    } catch (e) {}
}

const LockScreen = () => {
    // Check if already unlocked in this session
    const [isLocked, setIsLocked] = useState(() => {
        if (typeof window === 'undefined') return true
        return sessionStorage.getItem('macos_unlocked') !== 'true'
    })
    
    const [nameInput, setNameInput] = useState(() => {
        if (typeof window === 'undefined') return ''
        return sessionStorage.getItem('macos_visitor_name') || ''
    })

    const [currentTime, setCurrentTime] = useState(new Date())
    const [isSubmitting, setIsSubmitting] = useState(false)
    const lockScreenRef = useRef(null)

    // Update real-time clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Listen for global lock-screen events (from Apple menu)
    useEffect(() => {
        const handleLock = () => {
            setIsLocked(true)
            sessionStorage.removeItem('macos_unlocked')
            if (lockScreenRef.current) {
                gsap.to(lockScreenRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power3.out',
                    display: 'flex',
                })
            }
        }
        window.addEventListener('lock-macos', handleLock)
        return () => window.removeEventListener('lock-macos', handleLock)
    }, [])

    const handleUnlock = (e) => {
        if (e) e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)
        playUnlockChime()

        const visitorName = nameInput.trim() || 'Guest Explorer'
        sessionStorage.setItem('macos_unlocked', 'true')
        sessionStorage.setItem('macos_visitor_name', visitorName)

        // Broadcast unlock event so Welcome & Agent can personalize greeting
        window.dispatchEvent(new CustomEvent('macos-unlocked', { detail: { name: visitorName } }))

        // Smooth Apple slide-up transition
        if (lockScreenRef.current) {
            gsap.to(lockScreenRef.current, {
                y: '-100%',
                opacity: 0,
                duration: 0.55,
                ease: 'power3.inOut',
                onComplete: () => {
                    setIsLocked(false)
                    setIsSubmitting(false)
                },
            })
        } else {
            setIsLocked(false)
            setIsSubmitting(false)
        }
    }

    if (!isLocked) return null

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })

    return (
        <div
            ref={lockScreenRef}
            className='fixed inset-0 z-[100000] select-none flex flex-col justify-between p-6 sm:p-10 text-white bg-cover bg-center overflow-hidden'
            style={{
                backgroundImage: "url('/images/wallpaper-sequoia.jpg')",
            }}
        >
            {/* Ambient Backdrop Blur Overlay */}
            <div className='absolute inset-0 bg-black/25 backdrop-blur-md pointer-events-none' />

            {/* Top macOS Status Bar */}
            <header className='relative z-10 flex items-center justify-between text-xs font-medium text-white/90 drop-shadow-md'>
                <div className='flex items-center gap-4'>
                    <svg className='size-4 fill-current' viewBox='0 0 170 170'>
                        <path d='M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.96-14.42-5.46-8.36-9.76-17.65-12.91-27.87-3.16-10.22-4.73-20.02-4.73-29.41 0-14.42 3.66-26.4 10.98-35.94 7.32-9.54 16.59-14.41 27.81-14.61 4.7 0 9.87 1.25 15.51 3.75 5.64 2.5 9.4 3.86 11.28 4.08 2.25-.33 6.13-1.74 11.64-4.24 5.51-2.5 10.36-3.64 14.55-3.43 12.08.62 21.84 5.09 29.28 13.41-10.66 6.42-15.89 15.28-15.69 26.58.2 8.78 3.55 16.23 10.05 22.35 6.5 6.12 14.19 9.68 23.07 10.68-1.98 5.76-4.25 11.39-6.81 16.89zM119.22 31.84c0-7.39 2.67-14.37 8.01-20.94 5.34-6.57 11.89-10.42 19.65-11.55.22 1.33.33 2.66.33 3.99 0 7.39-2.73 14.45-8.19 21.18-5.46 6.73-12.11 10.61-19.95 11.64-.11-1.44-.17-2.88-.17-4.32z' />
                    </svg>
                    <span className='font-semibold tracking-wide'>MacBook Pro</span>
                </div>
                <div className='flex items-center gap-3.5'>
                    <Wifi className='size-3.5' />
                    <Volume2 className='size-3.5' />
                    <div className='flex items-center gap-1 font-mono text-[11px]'>
                        <Battery className='size-4 text-emerald-400' />
                        <span>100%</span>
                    </div>
                </div>
            </header>

            {/* Center Area: Big Clock & Profile Login */}
            <main className='relative z-10 flex flex-col items-center justify-center my-auto'>
                {/* Real-time macOS Typography Clock */}
                <div className='text-center mb-8 sm:mb-12'>
                    <h2 className='text-6xl sm:text-8xl font-bold tracking-tight text-white/95 font-georama drop-shadow-2xl'>
                        {formattedTime}
                    </h2>
                    <p className='text-sm sm:text-base font-medium text-white/80 mt-1 tracking-wide drop-shadow-md'>
                        {formattedDate}
                    </p>
                </div>

                {/* Profile Card */}
                <div className='flex flex-col items-center max-w-sm w-full'>
                    {/* User Avatar with Shimmer Ring */}
                    <div className='relative mb-4 group'>
                        <div className='absolute -inset-1.5 bg-gradient-to-tr from-amber-400 via-pink-500 to-cyan-400 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition duration-700 animate-pulse' />
                        <img
                            src='/images/Kishor.jpeg'
                            alt='Kishor Kumar Paroi'
                            className='relative size-20 sm:size-24 rounded-full object-cover border-2 border-white/80 shadow-2xl'
                            onError={(e) => {
                                e.target.onerror = null
                                e.target.src = '/images/profile.png'
                            }}
                        />
                    </div>

                    <h1 className='text-base sm:text-lg font-bold text-white tracking-wide text-center drop-shadow-md'>
                        Kishor Kumar Paroi
                    </h1>
                    <p className='text-[11px] text-amber-200/90 font-medium mb-4 tracking-wider uppercase text-center'>
                        Principal AI Systems Architect • Koom-AI
                    </p>

                    {/* Apple macOS Input Field */}
                    <form onSubmit={handleUnlock} className='w-full max-w-xs relative flex items-center'>
                        <div className='relative w-full flex items-center bg-white/20 hover:bg-white/25 focus-within:bg-white/30 backdrop-blur-2xl border border-white/35 rounded-full px-3.5 py-2 shadow-2xl transition-all duration-300'>
                            <User className='size-3.5 text-white/60 mr-2 shrink-0' />
                            <input
                                type='text'
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder='Enter your name to unlock...'
                                autoFocus
                                className='w-full bg-transparent border-none text-xs text-white placeholder-white/60 focus:outline-hidden font-medium'
                            />
                            <button
                                type='submit'
                                className={`size-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer ${
                                    nameInput.trim()
                                        ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-md scale-105'
                                        : 'bg-white/30 hover:bg-white/50 text-white'
                                }`}
                                title='Unlock macOS (Return ↵)'
                            >
                                <ArrowRight className='size-3.5' />
                            </button>
                        </div>
                    </form>

                    {/* Quick Guest Unlock Button */}
                    <button
                        onClick={() => {
                            setNameInput('Guest Explorer')
                            handleUnlock()
                        }}
                        className='mt-3 text-[11px] text-white/70 hover:text-white transition flex items-center gap-1.5 cursor-pointer underline decoration-white/30 hover:decoration-white'
                    >
                        <Sparkles className='size-3 text-amber-300' />
                        <span>Or click to continue as Guest</span>
                    </button>
                </div>
            </main>

            {/* Bottom System Power Controls */}
            <footer className='relative z-10 flex items-center justify-center gap-8 sm:gap-12 text-[11px] text-white/80 drop-shadow-md'>
                <button
                    onClick={() => {
                        setIsSubmitting(true)
                        setTimeout(() => setIsSubmitting(false), 800)
                    }}
                    className='flex flex-col items-center gap-1.5 hover:text-white transition group cursor-pointer'
                >
                    <div className='size-9 rounded-full bg-black/40 group-hover:bg-black/60 border border-white/20 flex items-center justify-center transition'>
                        <Moon className='size-4' />
                    </div>
                    <span>Sleep</span>
                </button>

                <button
                    onClick={() => {
                        window.location.reload()
                    }}
                    className='flex flex-col items-center gap-1.5 hover:text-white transition group cursor-pointer'
                >
                    <div className='size-9 rounded-full bg-black/40 group-hover:bg-black/60 border border-white/20 flex items-center justify-center transition'>
                        <RotateCcw className='size-4' />
                    </div>
                    <span>Restart</span>
                </button>

                <button
                    onClick={() => {
                        alert('System is locked in High-Security Mode. Enter your name above to explore.')
                    }}
                    className='flex flex-col items-center gap-1.5 hover:text-white transition group cursor-pointer'
                >
                    <div className='size-9 rounded-full bg-black/40 group-hover:bg-black/60 border border-white/20 flex items-center justify-center transition'>
                        <Power className='size-4' />
                    </div>
                    <span>Shut Down</span>
                </button>
            </footer>
        </div>
    )
}

export default LockScreen
