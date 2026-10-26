import { navIcons, navLinks, locations } from '#constants'
import useWindowStore from '#store/window'
import useLocationStore from '#store/location'
import dayjs from 'dayjs'
import React, { useState, useEffect, useRef } from 'react'
import { audioEngine } from '../utils/audioEngine'
import {
    Volume2,
    VolumeX,
    Music,
    Moon,
    Sun,
    Gift,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Shuffle,
    Swords,
    Gamepad2,
    Lock,
    Image as ImageIcon,
    RotateCw,
    Check,
    Wifi,
    Search,
    User,
    Sliders,
    CloudSun,
    ExternalLink,
    Laptop,
    HardDrive,
    Cpu,
    X,
    Folder,
    FileText,
    Shield,
    Globe,
    Radio,
    BatteryCharging,
} from 'lucide-react'

// Authentic Apple MacBook Wallpapers (macOS Sonoma Horizon default)
export const MACBOOK_WALLPAPERS = [
    {
        id: 'sonoma-horizon',
        name: 'macOS Sonoma Horizon',
        badge: 'Sonoma 4K',
        url: '/images/macbook-wallpaper-sonoma-horizon.jpg',
        thumb: '/images/macbook-wallpaper-sonoma-horizon.jpg',
        desc: 'Official Sonoma Horizon 4K hills',
    },
    {
        id: 'oceanic-blue',
        name: 'MacBook Pro Ocean Blue',
        badge: 'Retina 6K',
        url: '/images/macbook-wallpaper-2.jpg',
        thumb: '/images/macbook-wallpaper-2.jpg',
        desc: 'Deep oceanic fluid waves',
    },
    {
        id: 'royal-purple',
        name: 'MacBook Pro Royal Purple',
        badge: 'Retina 6K',
        url: '/images/macbook-wallpaper-3.jpg',
        thumb: '/images/macbook-wallpaper-3.jpg',
        desc: 'Vibrant royal purple ribbons',
    },
]

// Helper to apply wallpaper globally to HTML root, body and main elements
const applyWallpaperGlobal = (url) => {
    if (typeof document === 'undefined') return
    document.documentElement.style.setProperty('--macos-wallpaper', `url('${url}')`)
    document.body.style.backgroundImage = `url('${url}')`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    const mainEl = document.querySelector('main')
    if (mainEl) {
        mainEl.style.backgroundImage = `url('${url}')`
        mainEl.style.backgroundSize = 'cover'
        mainEl.style.backgroundPosition = 'center'
    }
}

const Navbar = () => {
    const { openWindow, focusWindow } = useWindowStore()
    const { setActiveLocation } = useLocationStore()
    const [audioState, setAudioState] = useState(audioEngine.getState())
    const [showSoundMenu, setShowSoundMenu] = useState(false)
    const [showGamesMenu, setShowGamesMenu] = useState(false)
    const [showWallpaperMenu, setShowWallpaperMenu] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Interactive macOS Menu Bar Popovers
    const [showWifiMenu, setShowWifiMenu] = useState(false)
    const [showSpotlight, setShowSpotlight] = useState(false)
    const [spotlightQuery, setSpotlightQuery] = useState('')
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showControlCenter, setShowControlCenter] = useState(false)
    const [wifiConnected, setWifiConnected] = useState(true)
    const [bluetoothConnected, setBluetoothConnected] = useState(true)
    const [airDropActive, setAirDropActive] = useState(true)
    const [brightness, setBrightness] = useState(100)

    const spotlightInputRef = useRef(null)

    const [wallpaperIndex, setWallpaperIndex] = useState(() => {
        if (typeof window === 'undefined') return 0
        const saved = localStorage.getItem('macos_wallpaper_idx')
        const parsed = parseInt(saved, 10)
        return !isNaN(parsed) && parsed >= 0 && parsed < MACBOOK_WALLPAPERS.length ? parsed : 0
    })

    const switchWallpaper = (newIdx) => {
        const nextIdx = (newIdx + MACBOOK_WALLPAPERS.length) % MACBOOK_WALLPAPERS.length
        setWallpaperIndex(nextIdx)
        const nextWp = MACBOOK_WALLPAPERS[nextIdx]
        applyWallpaperGlobal(nextWp.url)
        localStorage.setItem('macos_wallpaper', nextWp.url)
        localStorage.setItem('macos_wallpaper_idx', nextIdx.toString())
        window.dispatchEvent(new CustomEvent('set-wallpaper', { detail: { url: nextWp.url, index: nextIdx, name: nextWp.name } }))
    }

    const nextWallpaper = () => {
        switchWallpaper(wallpaperIndex + 1)
    }

    // Sync audio engine state
    useEffect(() => {
        const unsubscribe = audioEngine.subscribe(setAudioState)
        return unsubscribe
    }, [])

    // Global Keybindings: Spotlight (Cmd+Space / Ctrl+Space), Escape, Wallpaper rotate (W)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
                e.preventDefault()
                setShowSpotlight((prev) => !prev)
                return
            }
            if (e.key === 'Escape') {
                setShowSpotlight(false)
                setShowWifiMenu(false)
                setShowProfileMenu(false)
                setShowControlCenter(false)
                setShowSoundMenu(false)
                setShowGamesMenu(false)
                setShowWallpaperMenu(false)
                return
            }
            if (['input', 'textarea'].includes(e.target?.tagName?.toLowerCase())) return
            if (e.key === 'w' || e.key === 'W') {
                e.preventDefault()
                nextWallpaper()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [wallpaperIndex])

    // Focus input when spotlight opens
    useEffect(() => {
        if (showSpotlight) {
            setTimeout(() => {
                spotlightInputRef.current?.focus()
            }, 50)
        }
    }, [showSpotlight])

    // Initialize theme & apply official macOS Sonoma Horizon wallpaper
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

        const currentWp = MACBOOK_WALLPAPERS[wallpaperIndex] || MACBOOK_WALLPAPERS[0]
        applyWallpaperGlobal(currentWp.url)
        localStorage.setItem('macos_wallpaper', currentWp.url)
        localStorage.setItem('macos_wallpaper_idx', wallpaperIndex.toString())
        localStorage.setItem('macos_theme', isDark ? 'dark' : 'light')
        window.dispatchEvent(new CustomEvent('set-wallpaper', { detail: { url: currentWp.url, index: wallpaperIndex, name: currentWp.name } }))
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

    const closeAllPopovers = () => {
        setShowWifiMenu(false)
        setShowProfileMenu(false)
        setShowControlCenter(false)
        setShowSoundMenu(false)
        setShowGamesMenu(false)
        setShowWallpaperMenu(false)
    }

    const projects = Array.isArray(locations.work?.children) ? locations.work.children : []

    // Spotlight search results
    const filteredProjects = projects.filter((p) =>
        p.name.toLowerCase().includes(spotlightQuery.toLowerCase())
    )

    const apps = [
        { name: 'Finder (Work Projects)', type: 'finder', icon: '/images/finder.png' },
        { name: 'Terminal & Skills Engine', type: 'terminal', icon: '/images/terminal.png' },
        { name: 'Resume (ATS PDF & Tex)', type: 'resume', icon: '/images/pdf.png' },
        { name: 'Safari (15 Articles & Demos)', type: 'safari', icon: '/images/safari.png' },
        { name: '2-Min Blitz Chess AI', type: 'chess', icon: '/images/chess.svg' },
        { name: 'Clash Village Defense (RTS)', type: 'clash', icon: '/images/clash.svg' },
        { name: 'Nexus AI Multi-Agent Cockpit', type: 'aichat', icon: '/images/ai-agent.svg' },
        { name: 'Contact Me & Booking', type: 'contact', icon: '/images/contact.png' },
    ].filter((app) => app.name.toLowerCase().includes(spotlightQuery.toLowerCase()))

    const handleOpenProjectInFinder = (project) => {
        setActiveLocation(project)
        openWindow('finder')
        focusWindow('finder')
        setShowSpotlight(false)
    }

    const handleOpenApp = (appType) => {
        openWindow(appType)
        focusWindow(appType)
        setShowSpotlight(false)
    }

    return (
        <nav className='relative z-50'>
            <div>
                <img src='/images/logo.svg' alt='logo' className='size-4' />
                <p className='font-bold text-sm'>KKP's Macfolio</p>

                <ul>
                    {navLinks.map(({ id, name, type }) => (
                        <li key={id} onClick={() => openWindow(type)}>
                            <p>{name}</p>
                        </li>
                    ))}
                    {/* Games dropdown launcher */}
                    <li className='relative'>
                        <p
                            onClick={() => {
                                setShowGamesMenu(!showGamesMenu)
                                setShowSoundMenu(false)
                                setShowWallpaperMenu(false)
                            }}
                            className='flex items-center gap-1 text-amber-300 hover:text-amber-200 cursor-pointer'
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

                {/* macOS Lock Screen Button */}
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('lock-macos'))}
                    className='p-1.5 rounded-lg hover:bg-white/20 transition text-white flex items-center justify-center cursor-pointer'
                    title='Lock Screen (Return to MacBook Login Screen)'
                >
                    <Lock className='size-3.5 text-white/80 hover:text-white' />
                </button>

                {/* macOS Dark Mode / Light Mode Toggle */}
                <button
                    id='theme-toggle-btn'
                    onClick={toggleDarkMode}
                    className='p-1.5 rounded-lg hover:bg-white/20 transition text-white flex items-center justify-center cursor-pointer'
                    title={isDarkMode ? 'Switch to macOS Light Mode' : 'Switch to macOS Dark Mode'}
                >
                    {isDarkMode ? (
                        <Moon className='size-3.5 text-cyan-300 fill-cyan-400/30' />
                    ) : (
                        <Sun className='size-3.5 text-amber-300 fill-amber-300/30' />
                    )}
                </button>

                {/* macOS Wallpapers Selector Button */}
                <div className='relative'>
                    <button
                        onClick={() => {
                            setShowWallpaperMenu(!showWallpaperMenu)
                            setShowSoundMenu(false)
                            setShowGamesMenu(false)
                        }}
                        className='flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/20 transition text-white text-xs cursor-pointer'
                        title={`Current Wallpaper: ${MACBOOK_WALLPAPERS[wallpaperIndex]?.name} — Click to switch [W]`}
                    >
                        <ImageIcon className='size-3.5 text-pink-300' />
                        <span className='hidden sm:inline text-[11px] font-medium text-pink-200/90'>
                            Sonoma
                        </span>
                    </button>

                    {showWallpaperMenu && (
                        <div
                            className='absolute right-0 top-8 w-68 bg-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-3 shadow-2xl z-50 text-white text-xs select-none'
                            onMouseLeave={() => setShowWallpaperMenu(false)}
                        >
                            <div className='flex items-center justify-between pb-2 mb-2 border-b border-white/10'>
                                <div className='flex items-center gap-1.5 font-bold text-pink-300 text-[11px]'>
                                    <ImageIcon className='size-3.5 text-pink-400' />
                                    <span>Apple MacBook Wallpapers</span>
                                </div>
                                <button
                                    onClick={nextWallpaper}
                                    className='flex items-center gap-1 px-2 py-0.5 rounded bg-pink-500/20 hover:bg-pink-500/30 text-[10px] text-pink-200 border border-pink-400/40 transition cursor-pointer'
                                    title='Rotate Next [W]'
                                >
                                    <RotateCw className='size-2.5 text-pink-300' />
                                    <span>Switch</span>
                                </button>
                            </div>

                            <p className='text-[10px] text-gray-400 mb-2'>
                                Default: Sonoma Horizon • Click to choose:
                            </p>

                            <div className='space-y-1.5'>
                                {MACBOOK_WALLPAPERS.map((wp, idx) => (
                                    <button
                                        key={wp.id}
                                        onClick={() => {
                                            switchWallpaper(idx)
                                            setShowWallpaperMenu(false)
                                        }}
                                        className={`w-full flex items-center gap-2.5 p-1.5 rounded-xl border text-left transition cursor-pointer ${
                                            wallpaperIndex === idx
                                                ? 'bg-pink-500/20 border-pink-400/60 text-white shadow-xs'
                                                : 'border-white/10 hover:bg-white/10 text-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={wp.thumb}
                                            alt={wp.name}
                                            className='size-9 rounded-lg object-cover border border-white/20 shrink-0'
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center justify-between'>
                                                <span className='font-semibold text-xs truncate'>{wp.name}</span>
                                                <span className='text-[9px] font-mono px-1 py-0.5 rounded bg-white/10 text-gray-300 ml-1'>
                                                    {wp.badge}
                                                </span>
                                            </div>
                                            <p className='text-[10px] text-gray-400 truncate'>{wp.desc}</p>
                                        </div>
                                        {wallpaperIndex === idx && (
                                            <Check className='size-3.5 text-pink-400 shrink-0' />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Audio Player Controller */}
                <div className='relative'>
                    <button
                        onClick={() => {
                            setShowSoundMenu(!showSoundMenu)
                            setShowGamesMenu(false)
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition text-xs cursor-pointer ${
                            audioState.isPlaying ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-xs' : 'text-white/80 hover:bg-white/10'
                        }`}
                        title='Reinvent EDM & Beatbox Music Player (Press [M] to toggle)'
                    >
                        {audioState.isPlaying ? (
                            <>
                                <Music className='size-3.5 animate-pulse text-cyan-300' />
                                <span className='hidden sm:inline font-mono text-[11px] truncate max-w-24'>
                                    Track {audioState.currentTrackIndex + 1}
                                </span>
                            </>
                        ) : (
                            <Volume2 className='size-3.5' />
                        )}
                    </button>

                    {showSoundMenu && (
                        <div
                            className='absolute right-0 top-8 w-72 bg-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-3 shadow-2xl z-50 text-white text-xs select-none'
                            onMouseLeave={() => setShowSoundMenu(false)}
                        >
                            <div className='flex items-center justify-between pb-2 mb-2 border-b border-white/10'>
                                <div className='flex items-center gap-1.5 font-bold text-cyan-300 text-xs'>
                                    <Music className='size-4 text-cyan-400' />
                                    <span>30-Track Beatbox & EDM Mesh</span>
                                </div>
                                <span className='text-[10px] font-mono text-gray-400'>
                                    {audioState.currentTrackIndex + 1}/30
                                </span>
                            </div>

                            <p className='font-semibold text-xs text-white truncate mb-1'>
                                {audioState.currentTrack?.title || 'Track'}
                            </p>
                            <p className='text-[10px] text-gray-400 truncate mb-3'>
                                {audioState.currentTrack?.genre || 'EDM'} • {audioState.currentTrack?.bpm || 128} BPM
                            </p>

                            <div className='flex items-center justify-center gap-2 mb-3'>
                                <button
                                    onClick={() => audioEngine.prevTrack()}
                                    className='p-1.5 rounded-lg hover:bg-white/10 text-gray-300 transition cursor-pointer'
                                >
                                    <SkipBack className='size-3.5' />
                                </button>
                                <button
                                    onClick={() => audioEngine.togglePlay()}
                                    className='p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition shadow-md cursor-pointer'
                                >
                                    {audioState.isPlaying ? <Pause className='size-4' /> : <Play className='size-4 translate-x-0.5' />}
                                </button>
                                <button
                                    onClick={() => audioEngine.nextTrack()}
                                    className='p-1.5 rounded-lg hover:bg-white/10 text-gray-300 transition cursor-pointer'
                                >
                                    <SkipForward className='size-3.5' />
                                </button>
                                <button
                                    onClick={() => audioEngine.shuffle()}
                                    className='p-1.5 rounded-lg hover:bg-white/10 text-gray-300 transition cursor-pointer'
                                >
                                    <Shuffle className='size-3.5 text-cyan-300' />
                                </button>
                            </div>

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
                        </div>
                    )}
                </div>

                {/* macOS Nav Icons (Wi-Fi, Spotlight Search, User Profile, Control Center) */}
                <ul className='flex items-center gap-1.5'>
                    {/* 1. Wi-Fi Icon & Popover */}
                    <li className='relative'>
                        <button
                            onClick={() => {
                                closeAllPopovers()
                                setShowWifiMenu(!showWifiMenu)
                            }}
                            className='p-1.5 rounded-lg hover:bg-white/20 transition text-white flex items-center justify-center cursor-pointer'
                            title='Wi-Fi: Connected to Kishor-Mesh-5G'
                        >
                            <Wifi className={`size-3.5 ${wifiConnected ? 'text-white' : 'text-gray-400'}`} />
                        </button>

                        {showWifiMenu && (
                            <div
                                className='absolute right-0 top-8 w-64 bg-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-3 shadow-2xl z-50 text-white text-xs select-none'
                                onMouseLeave={() => setShowWifiMenu(false)}
                            >
                                <div className='flex items-center justify-between pb-2 mb-2 border-b border-white/10'>
                                    <span className='font-bold text-xs text-white'>Wi-Fi</span>
                                    <button
                                        onClick={() => setWifiConnected(!wifiConnected)}
                                        className={`w-9 h-5 rounded-full p-0.5 transition cursor-pointer ${
                                            wifiConnected ? 'bg-emerald-500' : 'bg-gray-700'
                                        }`}
                                    >
                                        <div
                                            className={`size-4 rounded-full bg-white transition-transform ${
                                                wifiConnected ? 'translate-x-4' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {wifiConnected ? (
                                    <div className='space-y-2'>
                                        <div className='p-2 rounded-xl bg-blue-600/20 border border-blue-500/30'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <Wifi className='size-3.5 text-blue-400' />
                                                    <span className='font-semibold text-xs text-white'>Kishor-Mesh-5G</span>
                                                </div>
                                                <Check className='size-3.5 text-blue-400' />
                                            </div>
                                            <p className='text-[10px] text-gray-300 mt-1 font-mono'>
                                                1200 Mbps • Latency: 4ms • WPA3
                                            </p>
                                        </div>

                                        <div className='text-[10px] text-gray-400 font-mono space-y-0.5 px-1'>
                                            <p>IP Address: 192.168.1.108</p>
                                            <p>Router: 192.168.1.1</p>
                                            <p>Security: WPA3 Personal</p>
                                        </div>

                                        <div className='pt-1 border-t border-white/10'>
                                            <p className='text-[10px] text-gray-400 font-semibold mb-1'>Known Networks</p>
                                            <p className='text-xs text-gray-300 py-1 px-1.5 rounded hover:bg-white/5 cursor-pointer'>
                                                KoomAI-Cloud-Fabric
                                            </p>
                                            <p className='text-xs text-gray-300 py-1 px-1.5 rounded hover:bg-white/5 cursor-pointer'>
                                                Fiber-Gigabit-Home
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className='text-xs text-gray-400 py-2 text-center'>Wi-Fi is turned off.</p>
                                )}
                            </div>
                        )}
                    </li>

                    {/* 2. Spotlight Search Icon */}
                    <li className='relative'>
                        <button
                            onClick={() => {
                                closeAllPopovers()
                                setShowSpotlight(true)
                            }}
                            className='p-1.5 rounded-lg hover:bg-white/20 transition text-white flex items-center justify-center cursor-pointer'
                            title='Spotlight Search (Cmd + Space)'
                        >
                            <Search className='size-3.5 text-white/90 hover:text-white' />
                        </button>
                    </li>

                    {/* 3. User / People Profile Icon & Popover */}
                    <li className='relative'>
                        <button
                            onClick={() => {
                                closeAllPopovers()
                                setShowProfileMenu(!showProfileMenu)
                            }}
                            className='p-1.5 rounded-lg hover:bg-white/20 transition text-white flex items-center justify-center cursor-pointer'
                            title="Kishor Kumar Paroi — Profile & Credentials"
                        >
                            <User className='size-3.5 text-white/90 hover:text-white' />
                        </button>

                        {showProfileMenu && (
                            <div
                                className='absolute right-0 top-8 w-76 bg-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-2xl z-50 text-white text-xs select-none'
                                onMouseLeave={() => setShowProfileMenu(false)}
                            >
                                <div className='flex items-center gap-3 pb-3 border-b border-white/10'>
                                    <img
                                        src='/images/Kishor.jpeg'
                                        alt='Kishor Kumar Paroi'
                                        className='size-12 rounded-full object-cover border-2 border-cyan-400 shadow-md'
                                    />
                                    <div>
                                        <h4 className='font-bold text-sm text-white'>Kishor Kumar Paroi</h4>
                                        <p className='text-[10px] text-cyan-300 font-mono'>Lead AI &amp; Systems Architect</p>
                                        <p className='text-[10px] text-amber-300 font-mono'>Founder @ KoomAI ($24K MRR)</p>
                                    </div>
                                </div>

                                <div className='py-2.5 space-y-1.5 text-[11px] text-gray-300'>
                                    <p className='flex items-center gap-1.5'>
                                        <Laptop className='size-3 text-cyan-400' />
                                        <span>B.Sc. in Electrical &amp; Electronic Eng. (RUET)</span>
                                    </p>
                                    <p className='flex items-center gap-1.5'>
                                        <Shield className='size-3 text-emerald-400' />
                                        <span>Codeforces 232nd Blue Coder • Rank 483rd BD</span>
                                    </p>
                                    <p className='flex items-center gap-1.5'>
                                        <Globe className='size-3 text-purple-400' />
                                        <span>Domain: <strong className='text-white'>kishor.tech</strong></span>
                                    </p>
                                </div>

                                <div className='pt-2 border-t border-white/10 flex flex-col gap-1.5'>
                                    <button
                                        onClick={() => {
                                            openWindow('resume')
                                            setShowProfileMenu(false)
                                        }}
                                        className='w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white text-center transition cursor-pointer text-xs'
                                    >
                                        View Resume (ATS PDF)
                                    </button>
                                    <div className='flex gap-1.5'>
                                        <a
                                            href='https://github.com/KishorKumarParoi'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='flex-1 py-1 rounded bg-white/10 hover:bg-white/20 text-center text-[10px] text-gray-200 transition'
                                        >
                                            GitHub
                                        </a>
                                        <a
                                            href='https://linkedin.com/in/kishor-kumar-paroi'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='flex-1 py-1 rounded bg-white/10 hover:bg-white/20 text-center text-[10px] text-gray-200 transition'
                                        >
                                            LinkedIn
                                        </a>
                                        <a
                                            href='mailto:kishor.kumar.paroi@gmail.com'
                                            className='flex-1 py-1 rounded bg-white/10 hover:bg-white/20 text-center text-[10px] text-gray-200 transition'
                                        >
                                            Email
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>

                    {/* 4. Control Center / Mode Icon */}
                    <li className='relative'>
                        <button
                            onClick={() => {
                                closeAllPopovers()
                                setShowControlCenter(!showControlCenter)
                            }}
                            className='p-1.5 rounded-lg hover:bg-white/20 transition text-white flex items-center justify-center cursor-pointer'
                            title='Control Center & Weather (Click time or icon)'
                        >
                            <Sliders className='size-3.5 text-white/90 hover:text-white' />
                        </button>
                    </li>
                </ul>

                {/* macOS Time (Click opens Control Center & Live Weather Sidebar) */}
                <time
                    onClick={() => {
                        closeAllPopovers()
                        setShowControlCenter(!showControlCenter)
                    }}
                    className='text-xs sm:text-sm font-medium text-white hover:text-cyan-300 transition cursor-pointer select-none'
                    title='Click to open macOS Control Center & Weather Widget'
                >
                    {dayjs().format('ddd MMM D h:mm A')}
                </time>
            </div>

            {/* =========================================================================
                macOS Control Center & Live Weather Sidebar Panel
                ========================================================================= */}
            {showControlCenter && (
                <div
                    className='absolute right-3 top-10 w-80 bg-gray-900/95 backdrop-blur-3xl border border-white/20 rounded-3xl p-4 shadow-2xl z-50 text-white select-none animate-in fade-in slide-in-from-top-2 duration-200'
                    onMouseLeave={() => setShowControlCenter(false)}
                >
                    {/* Live Weather Widget */}
                    <div className='p-3.5 rounded-2xl bg-gradient-to-br from-blue-600/40 via-sky-500/20 to-blue-900/40 border border-sky-400/30 mb-3 shadow-md'>
                        <div className='flex items-start justify-between'>
                            <div>
                                <span className='text-[10px] uppercase font-bold text-sky-200 tracking-wider flex items-center gap-1'>
                                    <CloudSun className='size-3.5 text-amber-300' />
                                    <span>Weather • Dhaka / Remote</span>
                                </span>
                                <div className='flex items-baseline gap-2 mt-1'>
                                    <span className='text-3xl font-extrabold text-white'>28°</span>
                                    <span className='text-xs font-medium text-sky-200'>Mostly Sunny</span>
                                </div>
                                <p className='text-[10px] text-sky-300/80 font-mono mt-0.5'>
                                    H: 31° • L: 22° • Feels like 30°
                                </p>
                            </div>
                            <span className='text-3xl animate-bounce duration-1000'>☀️</span>
                        </div>

                        {/* 5-Day Mini Forecast */}
                        <div className='mt-3 pt-2.5 border-t border-white/10 grid grid-cols-5 gap-1 text-center text-[10px] font-mono'>
                            <div>
                                <span className='text-gray-400'>Mon</span>
                                <p className='text-xs'>☀️</p>
                                <span className='text-white font-bold'>28°</span>
                            </div>
                            <div>
                                <span className='text-gray-400'>Tue</span>
                                <p className='text-xs'>⛅</p>
                                <span className='text-white font-bold'>29°</span>
                            </div>
                            <div>
                                <span className='text-gray-400'>Wed</span>
                                <p className='text-xs'>🌦️</p>
                                <span className='text-white font-bold'>27°</span>
                            </div>
                            <div>
                                <span className='text-gray-400'>Thu</span>
                                <p className='text-xs'>☀️</p>
                                <span className='text-white font-bold'>30°</span>
                            </div>
                            <div>
                                <span className='text-gray-400'>Fri</span>
                                <p className='text-xs'>☀️</p>
                                <span className='text-white font-bold'>28°</span>
                            </div>
                        </div>

                        <div className='mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] text-sky-200/80 font-mono'>
                            <span>Humidity: 56%</span>
                            <span>AQI: 42 (Good)</span>
                            <span>Wind: 11 km/h</span>
                        </div>
                    </div>

                    {/* Quick Controls Grid */}
                    <div className='grid grid-cols-2 gap-2 mb-3'>
                        <button
                            onClick={() => setWifiConnected(!wifiConnected)}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 transition cursor-pointer text-left ${
                                wifiConnected ? 'bg-blue-600/30 border-blue-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-400'
                            }`}
                        >
                            <Wifi className={`size-4 ${wifiConnected ? 'text-blue-400' : 'text-gray-400'}`} />
                            <div>
                                <p className='font-bold text-[11px] leading-tight'>Wi-Fi</p>
                                <p className='text-[9px] text-gray-400'>{wifiConnected ? 'Kishor-Mesh' : 'Off'}</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setBluetoothConnected(!bluetoothConnected)}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 transition cursor-pointer text-left ${
                                bluetoothConnected ? 'bg-blue-600/30 border-blue-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-400'
                            }`}
                        >
                            <Radio className={`size-4 ${bluetoothConnected ? 'text-blue-400' : 'text-gray-400'}`} />
                            <div>
                                <p className='font-bold text-[11px] leading-tight'>Bluetooth</p>
                                <p className='text-[9px] text-gray-400'>{bluetoothConnected ? 'AirPods Max' : 'Off'}</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setAirDropActive(!airDropActive)}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 transition cursor-pointer text-left ${
                                airDropActive ? 'bg-blue-600/30 border-blue-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-400'
                            }`}
                        >
                            <Globe className={`size-4 ${airDropActive ? 'text-blue-400' : 'text-gray-400'}`} />
                            <div>
                                <p className='font-bold text-[11px] leading-tight'>AirDrop</p>
                                <p className='text-[9px] text-gray-400'>{airDropActive ? 'Contacts' : 'Off'}</p>
                            </div>
                        </button>

                        <button
                            onClick={toggleDarkMode}
                            className='p-2.5 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition cursor-pointer text-left'
                        >
                            <div className='flex items-center gap-2'>
                                {isDarkMode ? <Moon className='size-4 text-cyan-300' /> : <Sun className='size-4 text-amber-300' />}
                                <div>
                                    <p className='font-bold text-[11px] leading-tight'>Dark Mode</p>
                                    <p className='text-[9px] text-gray-400'>{isDarkMode ? 'On' : 'Off'}</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Display Brightness Slider */}
                    <div className='p-2.5 rounded-xl bg-white/5 border border-white/10 mb-2'>
                        <div className='flex items-center justify-between text-[10px] text-gray-400 mb-1'>
                            <span className='flex items-center gap-1 font-semibold text-gray-300'>
                                <Sun className='size-3 text-amber-400' />
                                <span>Display Brightness</span>
                            </span>
                            <span>{brightness}%</span>
                        </div>
                        <input
                            type='range'
                            min='40'
                            max='100'
                            value={brightness}
                            onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                            className='w-full accent-amber-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg'
                        />
                    </div>

                    {/* Hardware Telemetry / System Specs */}
                    <div className='p-2.5 rounded-xl bg-black/40 border border-white/10 text-[10px] font-mono text-gray-400 space-y-1'>
                        <div className='flex items-center justify-between text-gray-300'>
                            <span className='flex items-center gap-1'>
                                <Cpu className='size-3 text-cyan-400' />
                                <span>Apple M3 Max</span>
                            </span>
                            <span className='text-emerald-400'>16-Core Neural</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='flex items-center gap-1'>
                                <HardDrive className='size-3 text-purple-400' />
                                <span>412.8 GB Available</span>
                            </span>
                            <span className='text-cyan-300'>18 GB Unified</span>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================================
                macOS Spotlight Search Modal (Cmd + Space)
                ========================================================================= */}
            {showSpotlight && (
                <div
                    className='fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]'
                    onClick={() => setShowSpotlight(false)}
                >
                    <div
                        className='w-[580px] max-w-[94vw] bg-gray-900/95 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden text-white select-none animate-in fade-in zoom-in-95 duration-150'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input Bar */}
                        <div className='flex items-center gap-3 px-4 py-3.5 border-b border-white/10'>
                            <Search className='size-5 text-gray-400 shrink-0' />
                            <input
                                ref={spotlightInputRef}
                                type='text'
                                value={spotlightQuery}
                                onChange={(e) => setSpotlightQuery(e.target.value)}
                                placeholder='Spotlight Search (Search projects, resume, terminal, apps)...'
                                className='w-full bg-transparent text-sm text-white placeholder-gray-400 outline-none border-none'
                            />
                            {spotlightQuery && (
                                <button
                                    onClick={() => setSpotlightQuery('')}
                                    className='text-gray-400 hover:text-white p-1'
                                >
                                    <X className='size-4' />
                                </button>
                            )}
                            <span className='text-[10px] font-mono text-gray-400 px-1.5 py-0.5 rounded bg-white/10 shrink-0'>
                                esc to close
                            </span>
                        </div>

                        {/* Search Results List */}
                        <div className='max-h-[50vh] overflow-y-auto p-2 space-y-1 text-xs'>
                            {/* Apps Section */}
                            {apps.length > 0 && (
                                <div className='mb-2'>
                                    <p className='px-3 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                                        Applications
                                    </p>
                                    {apps.map((app) => (
                                        <div
                                            key={app.type}
                                            onClick={() => handleOpenApp(app.type)}
                                            className='flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-600/40 cursor-pointer transition'
                                        >
                                            <img src={app.icon} alt={app.name} className='size-6 object-contain' />
                                            <span className='font-medium text-white'>{app.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Projects Section */}
                            {filteredProjects.length > 0 && (
                                <div>
                                    <p className='px-3 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                                        Work Projects (15 Systems)
                                    </p>
                                    {filteredProjects.map((proj) => (
                                        <div
                                            key={proj.id}
                                            onClick={() => handleOpenProjectInFinder(proj)}
                                            className='flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-600/40 cursor-pointer transition'
                                        >
                                            <div className='flex items-center gap-3 min-w-0'>
                                                <Folder className='size-5 text-cyan-400 shrink-0' />
                                                <span className='font-medium text-white truncate max-w-[380px]'>
                                                    {proj.name}
                                                </span>
                                            </div>
                                            <span className='text-[10px] text-cyan-300 font-mono shrink-0'>
                                                Open in Finder →
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {apps.length === 0 && filteredProjects.length === 0 && (
                                <p className='text-center text-gray-400 py-6 text-xs'>
                                    No results found for "{spotlightQuery}".
                                </p>
                            )}
                        </div>

                        {/* Footer Status */}
                        <div className='px-4 py-2 border-t border-white/10 bg-black/30 flex items-center justify-between text-[10px] text-gray-400 font-mono'>
                            <span>macOS Spotlight Search Engine</span>
                            <span>Press [Return] or Click to launch</span>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar