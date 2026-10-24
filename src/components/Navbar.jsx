import { navIcons, navLinks } from '#constants'
import useWindowStore from '#store/window'
import dayjs from 'dayjs'
import React, { useState, useEffect } from 'react'
import { audioEngine } from '../utils/audioEngine'
import { Volume2, VolumeX, Music, Moon, Sun, Gift, Play, Pause, SkipForward } from 'lucide-react'

const Navbar = () => {
    const { openWindow } = useWindowStore()
    const [audioState, setAudioState] = useState({
        isPlaying: false,
        currentTrack: 1,
        trackName: '432Hz Om & Handpan',
        volume: 0.25,
    })
    const [showSoundMenu, setShowSoundMenu] = useState(false)
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const unsubscribe = audioEngine.subscribe(setAudioState)
        return unsubscribe
    }, [])

    const toggleWallpaper = () => {
        setIsDark(!isDark)
        window.dispatchEvent(new CustomEvent('toggle-wallpaper'))
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
                    className='hidden sm:flex items-center gap-1 text-[11px] font-semibold bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full transition shadow-xs'
                    title='Click to reveal 2-Minute Surprise (Chess Blitz & Dark Theme)'
                >
                    <Gift className='size-3 text-amber-300 animate-pulse' />
                    <span>2m Surprise</span>
                </button>

                {/* Wallpaper Toggle Button */}
                <button
                    onClick={toggleWallpaper}
                    className='p-1 rounded hover:bg-white/20 text-white transition'
                    title={isDark ? 'Switch to Monterey Day Wallpaper' : 'Switch to Sonoma Dark Twilight Wallpaper'}
                >
                    {isDark ? <Sun className='size-3.5 text-yellow-300' /> : <Moon className='size-3.5 text-blue-200' />}
                </button>

                {/* Ambient Sound Controller */}
                <div className='relative'>
                    <button
                        onClick={() => setShowSoundMenu(!showSoundMenu)}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition text-xs ${
                            audioState.isPlaying ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40' : 'text-white/80 hover:bg-white/10'
                        }`}
                        title='Calm Ambient Sound Player (Handpan, Om, Flute, Rain)'
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
                        <div className='absolute right-0 top-7 w-64 bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-2xl z-50 text-white text-xs select-none'>
                            <div className='flex items-center justify-between mb-2 pb-1.5 border-b border-white/10'>
                                <div className='flex items-center gap-1.5 font-semibold text-cyan-300 text-[11px]'>
                                    <Music className='size-3.5' />
                                    <span>Focus Soundscape</span>
                                </div>
                                <span className='text-[10px] text-gray-400'>
                                    {audioState.currentTrack === 1 ? 'Track 1/2' : 'Track 2/2'}
                                </span>
                            </div>

                            <p className='font-bold text-xs truncate mb-2 text-white'>{audioState.trackName}</p>

                            <div className='flex items-center gap-2 mb-3'>
                                <button
                                    onClick={() => audioEngine.toggle()}
                                    className='flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-1.5 px-3 rounded-lg font-semibold text-xs shadow-xs transition'
                                >
                                    {audioState.isPlaying ? <Pause className='size-3.5' /> : <Play className='size-3.5' />}
                                    <span>{audioState.isPlaying ? 'Pause' : 'Play Music'}</span>
                                </button>
                                <button
                                    onClick={() => audioEngine.switchTrack(audioState.currentTrack === 1 ? 2 : 1)}
                                    className='p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition'
                                    title='Switch to Next Soundscape'
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
                <time>{dayjs().format("ddd MMM D h:mm A")}</time>
            </div>
        </nav>
    )
}

export default Navbar