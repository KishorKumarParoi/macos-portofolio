import React, { useState, useEffect, useRef } from 'react'
import useWindowStore from '#store/window'
import { audioEngine } from '../utils/audioEngine'
import { Sparkles, Trophy, Headphones, Volume2, X, Clock, Play } from 'lucide-react'

const NotificationCenter = () => {
    const { openWindow } = useWindowStore()
    const [notifications, setNotifications] = useState([])
    const [secondsElapsed, setSecondsElapsed] = useState(0)
    const [surpriseTriggered, setSurpriseTriggered] = useState(false)
    const [isDarkWallpaper, setIsDarkWallpaper] = useState(false)

    // Helper to push a notification
    const pushNotification = (notif) => {
        const id = Date.now() + Math.random()
        const newNotif = { id, ...notif }
        setNotifications((prev) => [newNotif, ...prev.slice(0, 4)])

        // Auto dismiss after 10s if not persistent
        if (!notif.persistent) {
            setTimeout(() => {
                dismissNotification(id)
            }, 9000)
        }
    }

    const dismissNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    const surpriseTriggeredRef = useRef(false)
    const intervalRef = useRef(null)

    // Apply wallpaper changes
    const applyWallpaper = (wallpaperUrl) => {
        const mainEl = document.querySelector('main')
        if (mainEl) {
            mainEl.style.backgroundImage = `url('${wallpaperUrl}')`
            mainEl.style.backgroundSize = 'cover'
            mainEl.style.backgroundPosition = 'center'
            mainEl.style.transition = 'background-image 0.8s ease-in-out'
        }
    }

    // Trigger 2-Minute Surprise — STRICTLY ONCE EVER
    const triggerSurprise = () => {
        if (surpriseTriggeredRef.current) return
        if (sessionStorage.getItem('macos_chess_surprise_shown')) return

        surpriseTriggeredRef.current = true
        sessionStorage.setItem('macos_chess_surprise_shown', 'true')
        setSurpriseTriggered(true)

        // Clear interval so it never checks or triggers again
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }

        // 1. Change wallpaper to twilight / dark
        applyWallpaper('/images/wallpaper-sequoia.jpg')

        // 2. Open Chess window
        openWindow('chess')

        // 3. Fire Blitz Challenge notification
        pushNotification({
            icon: '⚔️',
            title: '2-Minute Blitz Chess Challenge Begun!',
            subtitle: 'Beat the Minimax AI in 2 minutes to win a virtual MacBook! If you lose, gift AirPods to the computer!',
            type: 'challenge',
            persistent: true,
        })
    }

    // Mount: Initial notification & one-time timers
    useEffect(() => {
        const alreadyShown = sessionStorage.getItem('macos_chess_surprise_shown') === 'true'
        if (alreadyShown) {
            surpriseTriggeredRef.current = true
            setSurpriseTriggered(true)
        }

        // Initial opening notification if never shown
        let welcomeTimer = null
        if (!alreadyShown) {
            welcomeTimer = setTimeout(() => {
                pushNotification({
                    icon: '🎁',
                    title: 'Surprise in 2 Minutes!',
                    subtitle: 'Wait for 2 minutes to get a surprise! In the meantime, feel free to explore the portfolio, projects & terminal.',
                    type: 'info',
                    actionLabel: 'Preview Surprise ⚡',
                    onAction: () => triggerSurprise(),
                })
            }, 1200)

            // Global interval for 2-minute surprise and 1-minute audio switch
            intervalRef.current = setInterval(() => {
                setSecondsElapsed((prev) => {
                    const next = prev + 1

                    // At 60 seconds (1 minute): Shift audio soundscape
                    if (next === 60) {
                        audioEngine.switchTrack(2)
                        pushNotification({
                            icon: '🎵',
                            title: 'Soundscape Shifted',
                            subtitle: 'Transitioned to Lo-Fi Chillwave for deep focus.',
                            type: 'audio',
                        })
                    }

                    // At 120 seconds (2 minutes): Trigger the surprise ONCE!
                    if (next >= 120) {
                        triggerSurprise()
                    }

                    return next
                })
            }, 1000)
        }

        // Listen for chess game outcome events
        const handleChessWin = () => {
            pushNotification({
                icon: '💻',
                title: 'You Won a MACBOOK virtually! 🎉',
                subtitle: 'Grandmaster victory against Minimax AI! Screenshot this and claim your bragging rights!',
                type: 'win',
                persistent: true,
            })
        }

        const handleChessLoss = () => {
            pushNotification({
                icon: '🎧',
                title: 'Gift AirPods to Computer! 🎧',
                subtitle: 'You have to give AirPods as a gift to the computer, as the computer is tired from playing CHESS!',
                type: 'loss',
                persistent: true,
            })
        }

        const handleSetWallpaper = (e) => {
            if (e.detail?.url) {
                applyWallpaper(e.detail.url)
            }
        }

        window.addEventListener('chess-game-win', handleChessWin)
        window.addEventListener('chess-game-loss', handleChessLoss)
        window.addEventListener('set-wallpaper', handleSetWallpaper)
        window.addEventListener('trigger-surprise', triggerSurprise)

        return () => {
            if (welcomeTimer) clearTimeout(welcomeTimer)
            if (intervalRef.current) clearInterval(intervalRef.current)
            window.removeEventListener('chess-game-win', handleChessWin)
            window.removeEventListener('chess-game-loss', handleChessLoss)
            window.removeEventListener('set-wallpaper', handleSetWallpaper)
            window.removeEventListener('trigger-surprise', triggerSurprise)
        }
    }, [])

    return (
        <aside aria-label="macOS System Notifications" className='fixed top-9 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm pointer-events-none select-none'>
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className='pointer-events-auto bg-gray-900/85 backdrop-blur-xl border border-white/20 text-white rounded-2xl p-3.5 shadow-2xl drop-shadow-2xl animate-in fade-in slide-in-from-right duration-300 w-84 text-xs'
                >
                    <div className='flex items-start justify-between gap-2'>
                        <div className='flex items-center gap-2'>
                            <span className='text-lg shrink-0'>{n.icon || '🍎'}</span>
                            <div className='flex flex-col'>
                                <span className='text-[10px] uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1'>
                                    <span>System Assistant</span>
                                    {secondsElapsed < 120 && (
                                        <span className='text-gray-400 font-mono'>
                                            ({Math.max(0, 120 - secondsElapsed)}s left)
                                        </span>
                                    )}
                                </span>
                                <h4 className='font-bold text-white text-xs mt-0.5'>{n.title}</h4>
                            </div>
                        </div>
                        <button
                            onClick={() => dismissNotification(n.id)}
                            className='text-gray-400 hover:text-white p-1 rounded-full transition'
                            title='Close'
                        >
                            <X className='size-3.5' />
                        </button>
                    </div>

                    <p className='mt-2 text-gray-300 text-[11px] leading-relaxed'>{n.subtitle}</p>

                    {n.actionLabel && (
                        <div className='mt-3 flex justify-end gap-2'>
                            <button
                                onClick={() => {
                                    if (n.onAction) n.onAction()
                                    dismissNotification(n.id)
                                }}
                                className='px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-[11px] transition shadow-xs flex items-center gap-1'
                            >
                                <Sparkles className='size-3' />
                                {n.actionLabel}
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </aside>
    )
}

export default NotificationCenter
