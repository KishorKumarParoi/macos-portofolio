import { navIcons, navLinks } from '#constants'
import useWindowStore from '#store/window'
import dayjs from 'dayjs'
import React, { useState, useEffect } from 'react'
import { audioEngine } from '../utils/audioEngine'
import { Volume2, VolumeX, Music, Moon, Sun, Gift, Play, Pause, SkipForward, SkipBack, Shuffle, Swords, Gamepad2 } from 'lucide-react'

// Official MacBook Sequoia Wallpaper (Locked as the sole macOS wallpaper)
const MACBOOK_WALLPAPER = '/images/wallpaper-sequoia.jpg'

// Helper to apply wallpaper globally to both body and main element
const applyWallpaperGlobal = () => {
    if (typeof document === 'undefined') return
    document.body.style.backgroundImage = `url('${MACBOOK_WALLPAPER}')`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    const mainEl = document.querySelector('main')
    if (mainEl) {
        mainEl.style.backgroundImage = `url('${MACBOOK_WALLPAPER}')`
        mainEl.style.backgroundSize = 'cover'
        mainEl.style.backgroundPosition = 'center'
    }
}

const Navbar = () => {
    const { openWindow } = useWindowStore()
    const [audioState, setAudioState] = useState(audioEngine.getState())
    const [showSoundMenu, setShowSoundMenu] = useState(false)
    const [showGamesMenu, setShowGamesMenu] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Sync audio engine state
    useEffect(() => {
        const unsubscribe = audioEngine.subscribe(setAudioState)
        return unsubscribe
    }, [])

    // Initialize theme & lock official MacBook wallpaper
    useEffect(() => {
        const savedTheme = localStorage.getItem('macos_theme')
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        const isDark = savedTheme ? savedTheme === 'dark' : prefersDark

        setIsDarkMode(isDark)
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        applyWallpaperGlobal()
        localStorage.setItem('macos_wallpaper', MACBOOK_WALLPAPER)
        localStorage.setItem('macos_theme', isDark ? 'dark' : 'light')
        window.dispatchEvent(new CustomEvent('set-wallpaper', { detail: { url: MACBOOK_WALLPAPER } }))
    }, [])

    const toggleDarkMode = () => {
        const nextMode = !isDarkMode
        setIsDarkMode(nextMode)
        if (nextMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('macos_theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('macos_theme', 'light')
        }
    }

    const triggerSurpriseNow = () => {
        window.dispatchEvent(new CustomEvent('trigger-surprise'))
    }

    return (
        <nav className='relative'>
            <div>
                <img src='/images/logo.svg' alt='logo' />
                <p className='font-bold'>KKP's Macfolio</p>

                <ul>
                    {
                        navLinks.map(({ id, name, type }) => (
                            <li key={id} onClick={() => openWindow(type)}>
                                <p>{name}</p>
                            </li>
                        ))
                    }
                    {/* Games dropdown launcher */}
                    <li className='relative'>
                        <p 
                            onClick={() => {
                                setShowGamesMenu(!showGamesMenu)
                                setShowSoundMenu(false)
                            }}
                            className='flex items-center gap-1 text-amber-300 hover:text-amber-200'
                        >
                            <Gamepad2 className='size-3.5' />
                            <span>Games</span>
                        </p>

                        {showGamesMenu && (
                            <div 
                                className='absolute left-0 top-7 w-56 bg-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-xl p-2 shadow-2xl z-50 text-white text-xs select-none'
                                onMouseLeave={() => setShowGamesMenu(false)}
                            >
                                <div className='px-2 py-1 text-[10px] uppercase font-bold text-amber-300 tracking-wider border-b border-white/10 mb-1'>
                                    Play Games Anytime
                                </div>
                                <button
                                    onClick={() => {
                                        openWindow('chess')
                                        setShowGamesMenu(false)
                                    }}
                                    className='w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 text-left transition cursor-pointer'
                                >
                                    <span className='text-base'>♟️</span>
                                    <div>
                                        <p className='font-semibold text-xs text-white'>2-Min Blitz Chess AI</p>
                                        <p className='text-[10px] text-gray-400'>Minimax AI • Win MacBook</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        openWindow('clash')
                                        setShowGamesMenu(false)
                                    }}
                                    className='w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 text-left transition cursor-pointer'
                                >
                                    <Swords className='size-4 text-red-400' />
                                    <div>
                                        <p className='font-semibold text-xs text-white'>Clash Village Defense</p>
                                        <p className='text-[10px] text-gray-400'>RTS War • Cannons &amp; Wizards</p>
                                    </div>
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            </div>

            <div className='flex items-center gap-2'>
                {/* 2-Min Surprise Instant Trigger Badge */}
                <button
                    onClick={triggerSurpriseNow}
                    className='hidden sm:flex items-center gap-1 text-[11px] font-semibold bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full transition shadow-xs cursor-pointer'
                    title='Click to reveal 2-Minute Surprise Notification'
                >
                    <Gift className='size-3 text-amber-300 animate-pulse' />
                    <span>2m Surprise</span>
                </button>

                {/* macOS Dark Mode / Light Mode Toggle */}
                <button
                    id='theme-toggle-btn'
                    onClick={toggleDarkMode}
                    className='p-1.5 rounded-lg hover:bg-white/20 transition text-white flex items-center justify-center cursor-pointer'
                    title={isDarkMode ? 'Switch to macOS Light Mode (Sequoia)' : 'Switch to macOS Dark Mode (Monterey)'}
                >
                    {isDarkMode ? (
                        <Moon className='size-3.5 text-cyan-300 fill-cyan-400/30' />
                    ) : (
                        <Sun className='size-3.5 text-amber-300 fill-amber-300/30' />
                    )}
                </button>

                {/* Reinvent-Style 30-Track Beatbox/EDM Audio Player Controller */}
                <div className='relative'>
                    <button
                        onClick={() => {
                            setShowSoundMenu(!showSoundMenu)
                            setShowGamesMenu(false)
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition text-xs cursor-pointer ${
                            audioState.isPlaying ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-xs' : 'text-white/80 hover:bg-white/10'
                        }`}
                        title='Reinvent EDM & Beatbox Music Player (Press [M] to toggle, [N] next, [R] shuffle)'
                    >
                        {audioState.isPlaying ? (
                            <>
                                <Volume2 className='size-3.5 text-cyan-300 animate-pulse' />
                                <span className='flex gap-0.5 items-end h-3'>
                                    <span className='w-0.5 bg-cyan-300 h-2 animate-bounce'></span>
                                    <span className='w-0.5 bg-cyan-300 h-3 animate-bounce delay-100'></span>
                                    <span className='w-0.5 bg-cyan-300 h-1.5 animate-bounce delay-200'></span>
                                </span>
                                <span className='hidden md:inline font-mono text-[10px] text-cyan-200 truncate max-w-[110px]'>
                                    {audioState.title?.split('(')[0] || 'EDM Beat'}
                                </span>
                            </>
                        ) : (
                            <VolumeX className='size-3.5 text-gray-300' />
                        )}
                    </button>

                    {/* Sound Control Dropdown Card */}
                    {showSoundMenu && (
                        <div 
                            className='absolute right-0 top-8 w-74 bg-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-3.5 shadow-2xl z-50 text-white text-xs select-none'
                            onMouseLeave={() => setShowSoundMenu(false)}
                        >
                            <div className='flex items-center justify-between mb-2 pb-1.5 border-b border-white/10'>
                                <div className='flex items-center gap-1.5 font-semibold text-cyan-300 text-[11px]'>
                                    <Music className='size-3.5 text-cyan-400' />
                                    <span>Reinvent 30-Track Beatbox &amp; EDM</span>
                                </div>
                                <span className='text-[10px] text-gray-400 font-mono'>
                                    #{audioState.currentTrack}/{audioState.totalTracks || 30}
                                </span>
                            </div>

                            <p className='font-bold text-xs truncate text-white'>{audioState.title}</p>
                            <p className='text-[10px] text-cyan-300 truncate mb-1'>{audioState.artist}</p>
                            
                            <div className='flex items-center justify-between text-[10px] text-gray-400 mb-2 font-mono'>
                                <span>{audioState.genre} • {audioState.mood}</span>
                                <span>{120 - (audioState.secondsPlayed || 0)}s auto</span>
                            </div>

                            {/* Control Buttons */}
                            <div className='flex items-center gap-1.5 mb-3'>
                                <button
                                    onClick={() => audioEngine.prevTrack()}
                                    className='p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer'
                                    title='Previous Track [P]'
                                >
                                    <SkipBack className='size-3.5' />
                                </button>
                                <button
                                    onClick={() => audioEngine.toggle()}
                                    className='flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-1.5 px-3 rounded-lg font-semibold text-xs shadow-md transition cursor-pointer'
                                >
                                    {audioState.isPlaying ? <Pause className='size-3.5' /> : <Play className='size-3.5' />}
                                    <span>{audioState.isPlaying ? 'Pause' : 'Play Beatbox/EDM'}</span>
                                </button>
                                <button
                                    onClick={() => audioEngine.nextTrack()}
                                    className='p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer'
                                    title='Next Track [N]'
                                >
                                    <SkipForward className='size-3.5' />
                                </button>
                                <button
                                    onClick={() => audioEngine.shuffle()}
                                    className='p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer'
                                    title='Shuffle Track [R]'
                                >
                                    <Shuffle className='size-3.5 text-cyan-300' />
                                </button>
                            </div>

                            {/* Volume Slider */}
                            <div className='flex items-center gap-2 text-[10px] text-gray-400'>
                                <span>Vol:</span>
                                <input
                                    type='range'
                                    min='0'
                                    max='1'
                                    step='0.05'
                                    value={audioState.volume}
                                    onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
                                    className='w-full accent-cyan-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg'
                                />
                            </div>

                            {/* Hotkey hint */}
                            <div className='mt-2 pt-1.5 border-t border-white/5 text-[9px] text-gray-400 text-center font-mono'>
                                Hotkeys: [M] Play/Pause • [N] Next • [P] Prev • [R] Shuffle
                            </div>
                        </div>
                    )}
                </div>

                <ul>
                    {navIcons.map(({ id, img }) => (
                        <li key={id}>
                            <img src={img} className='icon-hover' />
                        </li>
                    ))}
                </ul>

                <time>{dayjs().format('ddd MMM D h:mm A')}</time>
            </div>
        </nav>
    )
}

export default Navbar