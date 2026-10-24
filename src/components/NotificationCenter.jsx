import React, { useState, useEffect, useRef } from 'react'
import useWindowStore from '#store/window'
import { Sparkles, Trophy, Headphones, Volume2, X, Clock, Play, Swords } from 'lucide-react'

const NotificationCenter = () => {
    const { openWindow } = useWindowStore()
    const [notifications, setNotifications] = useState([])
    const [secondsElapsed, setSecondsElapsed] = useState(0)
    const [surpriseTriggered, setSurpriseTriggered] = useState(false)

    // Helper to push a notification
    const pushNotification = (notif) => {
        const id = Date.now() + Math.random()
        const newNotif = { id, ...notif }
        setNotifications((prev) => [newNotif, ...prev.slice(0, 4)])

        // Auto dismiss after 12s if not persistent
        if (!notif.persistent) {
            setTimeout(() => {
                dismissNotification(id)
            }, 12000)
        }
    }

    const dismissNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    const surpriseTriggeredRef = useRef(false)
    const intervalRef = useRef(null)

    // Strictly lock official MacBook wallpaper
    const applyWallpaper = () => {
        if (typeof document === 'undefined') return
        const macbookWp = '/images/wallpaper-sequoia.jpg'
        document.body.style.backgroundImage = `url('${macbookWp}')`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        const mainEl = document.querySelector('main')
        if (mainEl) {
            mainEl.style.backgroundImage = `url('${macbookWp}')`
            mainEl.style.backgroundSize = 'cover'
            mainEl.style.backgroundPosition = 'center'
        }
    }

    // Trigger 2-Minute Surprise — User can choose to play now or dismiss & play later
    const triggerSurprise = () => {
        if (surpriseTriggeredRef.current) return
        if (sessionStorage.getItem('macos_chess_surprise_shown')) return

        surpriseTriggeredRef.current = true
        sessionStorage.setItem('macos_chess_surprise_shown', 'true')
        setSurpriseTriggered(true)

        // Clear interval so it never triggers again
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }

        // Fire Surprise notification without force-opening windows
        pushNotification({
            icon: '🎁',
            title: '2-Minute Surprise: Games Arena Unlocked!',
            subtitle: 'You unlocked Minimax Blitz Chess AI & Clash Village Defense RTS! Click Play Now, or Dismiss to play anytime from the Dock or Top Menu.',
            type: 'challenge',
            persistent: true,
            actions: [
                {
                    label: 'Play Chess ♟️',
                    primary: true,
                    onClick: () => openWindow('chess'),
                },
                {
                    label: 'Play Clash RTS ⚔️',
                    primary: true,
                    onClick: () => openWindow('clash'),
                },
                {
                    label: 'Dismiss / Play Later',
                    primary: false,
                    onClick: () => {},
                },
            ],
        })
    }

    // Mount: Initial notification & one-time timers
    useEffect(() => {
        const alreadyShown = sessionStorage.getItem('macos_chess_surprise_shown') === 'true'
        if (alreadyShown) {
            surpriseTriggeredRef.current = true
            setSurpriseTriggered(true)
        }

        let welcomeTimer = null
        if (!alreadyShown) {
            welcomeTimer = setTimeout(() => {
                pushNotification({
                    icon: '🎁',
                    title: 'Surprise in 2 Minutes!',
                    subtitle: 'A special surprise unlocks in 2 minutes! In the meantime, explore the portfolio, projects, and terminal.',
                    type: 'info',
                    actions: [
                        {
                            label: 'Preview Surprise ⚡',
                            primary: true,
                            onClick: () => triggerSurprise(),
                        },
                        {
                            label: 'Got it',
                            primary: false,
                            onClick: () => {},
                        },
                    ],
                })
            }, 1200)

            // Global interval for 2-minute surprise
            intervalRef.current = setInterval(() => {
                setSecondsElapsed((prev) => {
                    const next = prev + 1

                    // At 120 seconds (2 minutes): Trigger the surprise
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

        const handleSetWallpaper = () => {
            applyWallpaper()
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
                    className='pointer-events-auto bg-gray-900/90 backdrop-blur-xl border border-white/20 text-white rounded-2xl p-3.5 shadow-2xl drop-shadow-2xl animate-in fade-in slide-in-from-right duration-300 w-84 text-xs'
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
                            className='text-gray-400 hover:text-white p-1 rounded-full transition cursor-pointer'
                            title='Close / Dismiss'
                        >
                            <X className='size-3.5' />
                        </button>
                    </div>

                    <p className='mt-2 text-gray-300 text-[11px] leading-relaxed'>{n.subtitle}</p>

                    {/* Action Buttons */}
                    {n.actions && n.actions.length > 0 && (
                        <div className='mt-3 flex flex-wrap justify-end gap-1.5'>
                            {n.actions.map((act, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (act.onClick) act.onClick()
                                        dismissNotification(n.id)
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition shadow-xs flex items-center gap-1 cursor-pointer ${
                                        act.primary
                                            ? 'bg-amber-400 hover:bg-amber-300 text-black'
                                            : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10'
                                    }`}
                                >
                                    {act.primary && <Sparkles className='size-2.5' />}
                                    {act.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </aside>
    )
}

export default NotificationCenter
