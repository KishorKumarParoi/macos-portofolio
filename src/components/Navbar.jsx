import { navIcons, navLinks } from '#constants'
import useWindowStore from '#store/window'
import dayjs from 'dayjs'
import React, { useState, useEffect } from 'react'
import { audioEngine } from '../utils/audioEngine'
import { Volume2, VolumeX, Music, Moon, Sun, Gift, Play, Pause, SkipForward, SkipBack, Image, Palette, Check } from 'lucide-react'

const WALLPAPERS = [
    { id: 'sonoma-light', name: 'macOS Sonoma Day', url: '/images/wallpaper.png', preview: '/images/wallpaper.png' },
    { id: 'sequoia', name: 'macOS Sequoia Sunset', url: '/images/wallpaper-sequoia.jpg', preview: '/images/wallpaper-sequoia.jpg' },
    { id: 'sonoma-dark', name: 'Sonoma Golden Hills', url: '/images/wallpaper-sonoma.jpg', preview: '/images/wallpaper-sonoma.jpg' },
    { id: 'monterey', name: 'Monterey Abstract Dark', url: '/images/wallpaper-monterey.jpg', preview: '/images/wallpaper-monterey.jpg' },
    { id: 'ventura', name: 'Ventura Sunburst Amber', url: '/images/wallpaper-ventura.jpg', preview: '/images/wallpaper-ventura.jpg' },
    { id: 'twilight', name: 'Cyber Twilight Aurora', url: '/images/wallpaper-twilight.jpg', preview: '/images/wallpaper-twilight.jpg' },
    { id: 'dark', name: 'Midnight Nebula Dark', url: '/images/wallpaper-dark.jpg', preview: '/images/wallpaper-dark.jpg' },
]

const Navbar = () => {
    const { openWindow } = useWindowStore()
    const [audioState, setAudioState] = useState({
        isPlaying: false,
        currentTrack: 1,
        trackName: 'Focus Zen & Ambient Piano',
        volume: 0.35,
        tracks: []
    })
    const [showSoundMenu, setShowSoundMenu] = useState(false)
    const [showWallpaperMenu, setShowWallpaperMenu] = useState(false)
    const [activeWallpaper, setActiveWallpaper] = useState('/images/wallpaper.png')

    useEffect(() => {
        const unsubscribe = audioEngine.subscribe(setAudioState)
        return unsubscribe
    }, [])

    const handleSelectWallpaper = (url) => {
        setActiveWallpaper(url)
        window.dispatchEvent(new CustomEvent('set-wallpaper', { detail: { url } }))
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
                </ul>
            </div>

            <div className='flex items-center gap-2'>
                {/* 2-Min Surprise Instant Trigger Badge */}
                <button
                    onClick={triggerSurpriseNow}
                    className='hidden sm:flex items-center gap-1 text-[11px] font-semibold bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full transition shadow-xs cursor-pointer'
                    title='Click to reveal 2-Minute Surprise (Chess Blitz & Dark Theme)'
                >
                    <Gift className='size-3 text-amber-300 animate-pulse' />
                    <span>2m Surprise</span>
                </button>

                {/* Wallpaper Gallery Dropdown Menu */}
                <div className='relative'>
                    <button
                        onClick={() => {
                            setShowWallpaperMenu(!showWallpaperMenu)
                            setShowSoundMenu(false)
                        }}
                        className={`p-1.5 rounded hover:bg-white/20 transition flex items-center gap-1 cursor-pointer ${
                            showWallpaperMenu ? 'bg-white/20 text-cyan-300' : 'text-white'
                        }`}
                        title='Choose Desktop 4K Wallpaper'
                    >
                        <Palette className='size-3.5' />
                    </button>

                    {showWallpaperMenu && (
                        <div 
                            className='absolute right-0 top-8 w-64 bg-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-3 shadow-2xl z-50 text-white text-xs select-none'
                            onMouseLeave={() => setShowWallpaperMenu(false)}
                        >
                            <div className='flex items-center justify-between mb-2 pb-1.5 border-b border-white/10'>
                                <span className='font-bold text-[11px] uppercase tracking-wider text-cyan-300'>Desktop Wallpapers</span>
                                <span className='text-[10px] text-gray-400 font-mono'>{WALLPAPERS.length} Styles</span>
                            </div>
                            <div className='grid grid-cols-1 gap-1.5 max-h-60 overflow-y-auto pr-1'>
                                {WALLPAPERS.map((wp) => (
                                    <button
                                        key={wp.id}
                                        onClick={() => handleSelectWallpaper(wp.url)}
                                        className={`flex items-center justify-between p-1.5 rounded-lg text-left transition cursor-pointer ${
                                            activeWallpaper === wp.url ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40' : 'hover:bg-white/10 text-gray-300 hover:text-white'
                                        }`}
                                    >
                                        <div className='flex items-center gap-2'>
                                            <div 
                                                className='w-7 h-5 rounded border border-white/30 bg-cover bg-center shrink-0'
                                                style={{ backgroundImage: `url('${wp.url}')` }}
                                            />
                                            <span className='font-medium text-[11px] truncate'>{wp.name}</span>
                                        </div>
                                        {activeWallpaper === wp.url && <Check className='size-3 text-cyan-400' />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Ambient Sound Controller */}
                <div className='relative'>
                    <button
                        onClick={() => {
                            setShowSoundMenu(!showSoundMenu)
                            setShowWallpaperMenu(false)
                        }}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition text-xs cursor-pointer ${
                            audioState.isPlaying ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40' : 'text-white/80 hover:bg-white/10'
                        }`}
                        title='Calm Ambient Sound Player'
                    >
                        {audioState.isPlaying ? (
                            <>
                                <Volume2 className='size-3.5 text-cyan-300' />
                                <span className='flex gap-0.5 items-end h-3'>
                                    <span className='w-0.5 bg-cyan-300 h-2 animate-pulse'></span>
                                    <span className='w-0.5 bg-cyan-300 h-3 animate-pulse delay-75'></span>
                                    <span className='w-0.5 bg-cyan-300 h-1.5 animate-pulse delay-150'></span>
                                </span>
                            </>
                        ) : (
                            <VolumeX className='size-3.5 text-gray-300' />
                        )}
                    </button>

                    {/* Sound Control Dropdown Card */}
                    {showSoundMenu && (
                        <div 
                            className='absolute right-0 top-8 w-68 bg-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-3.5 shadow-2xl z-50 text-white text-xs select-none'
                            onMouseLeave={() => setShowSoundMenu(false)}
                        >
                            <div className='flex items-center justify-between mb-2 pb-1.5 border-b border-white/10'>
                                <div className='flex items-center gap-1.5 font-semibold text-cyan-300 text-[11px]'>
                                    <Music className='size-3.5' />
                                    <span>Focus Audio Player</span>
                                </div>
                                <span className='text-[10px] text-gray-400 font-mono'>
                                    Track {audioState.currentTrack}/5
                                </span>
                            </div>

                            <p className='font-bold text-xs truncate mb-2.5 text-white'>{audioState.trackName}</p>

                            <div className='flex items-center gap-1.5 mb-3'>
                                <button
                                    onClick={() => audioEngine.prevTrack()}
                                    className='p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer'
                                    title='Previous Track'
                                >
                                    <SkipBack className='size-3.5' />
                                </button>
                                <button
                                    onClick={() => audioEngine.toggle()}
                                    className='flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-1.5 px-3 rounded-lg font-semibold text-xs shadow-md transition cursor-pointer'
                                >
                                    {audioState.isPlaying ? <Pause className='size-3.5' /> : <Play className='size-3.5' />}
                                    <span>{audioState.isPlaying ? 'Pause' : 'Play Music'}</span>
                                </button>
                                <button
                                    onClick={() => audioEngine.nextTrack()}
                                    className='p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer'
                                    title='Next Track'
                                >
                                    <SkipForward className='size-3.5' />
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