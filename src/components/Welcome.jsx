import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef, useState, useEffect } from 'react'
import { Sparkles, Star } from 'lucide-react'

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

const Welcome = () => {
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)
    const canvasRef = useRef(null)
    
    // Visitor name greeting (synced with LockScreen login)
    const [visitorName, setVisitorName] = useState(() => {
        if (typeof window === 'undefined') return ''
        return sessionStorage.getItem('macos_visitor_name') || ''
    })

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
            if (meteors.length < 3) {
                meteors.push({
                    x: Math.random() * window.innerWidth * 0.8,
                    y: Math.random() * window.innerHeight * 0.4,
                    length: Math.random() * 90 + 60,
                    speed: Math.random() * 8 + 6,
                    angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
                    opacity: 1,
                })
            }
        }
        const meteorInterval = setInterval(spawnMeteor, 2400)

        // Interactive Click Burst Particles
        const burstParticles = []
        const handleClick = (e) => {
            for (let i = 0; i < 18; i++) {
                const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3
                const speed = Math.random() * 3.5 + 1.5
                burstParticles.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    radius: Math.random() * 2.5 + 1,
                    alpha: 1,
                    color: ['#fbbf24', '#f43f5e', '#38bdf8', '#a855f7'][Math.floor(Math.random() * 4)],
                })
            }
        }
        window.addEventListener('click', handleClick)

        // Render Loop
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw Twinkling Stars
            stars.forEach((star) => {
                star.alpha += star.speed
                if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed

                ctx.save()
                ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha))
                ctx.shadowBlur = 8
                ctx.shadowColor = star.color
                ctx.fillStyle = star.color
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
                ctx.fill()
                ctx.restore()
            })

            // Draw Meteors (Shooting Stars)
            for (let i = meteors.length - 1; i >= 0; i--) {
                const m = meteors[i]
                ctx.save()
                ctx.globalAlpha = m.opacity
                const endX = m.x - Math.cos(m.angle) * m.length
                const endY = m.y - Math.sin(m.angle) * m.length

                const gradient = ctx.createLinearGradient(m.x, m.y, endX, endY)
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
                gradient.addColorStop(0.3, 'rgba(251, 191, 36, 0.8)')
                gradient.addColorStop(1, 'rgba(56, 189, 248, 0)')

                ctx.strokeStyle = gradient
                ctx.lineWidth = 2
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

    return (
        <section id='welcome' className='relative z-1 pointer-events-none'>
            {/* Background Interactive Starfield Canvas */}
            <canvas
                ref={canvasRef}
                className='fixed inset-0 pointer-events-auto z-0 opacity-80'
            />

            {/* Glowing Nebula Backdrop Behind Namaste */}
            <div className='absolute -top-16 left-1/2 -translate-x-1/2 w-[520px] h-48 bg-gradient-to-r from-amber-500/20 via-pink-500/15 to-cyan-500/20 blur-3xl rounded-full pointer-events-none animate-pulse' />

            {/* Vedic Sanskrit Greeting Aura Pill */}
            <div className='relative z-10 mb-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-amber-400/30 backdrop-blur-md shadow-lg pointer-events-auto hover:border-amber-400/60 transition cursor-default group'>
                <span className='size-2 rounded-full bg-amber-400 animate-ping' />
                <span className='text-[11px] font-mono font-bold tracking-widest uppercase bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 bg-clip-text text-transparent flex items-center gap-1.5'>
                    <span>🙏 ॐ Welcome to my Digital Universe</span>
                </span>
                <Sparkles className='size-3 text-amber-300 group-hover:rotate-45 transition-transform' />
            </div>

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

            {/* Portfolio Master Title */}
            <h1 
                ref={titleRef} 
                className='relative z-10 mt-3 sm:mt-5 text-7xl sm:text-9xl italic font-georama font-extrabold text-white/90 drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] tracking-tight pointer-events-auto'
            >
                {renderText('portfolio', 'font-georama')}
            </h1>

            {/* Subtitle Credentials Badge */}
            <p className='relative z-10 mt-4 text-xs sm:text-sm font-mono text-gray-300/90 bg-black/45 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full shadow-xl pointer-events-auto flex items-center gap-2'>
                <Star className='size-3 text-amber-400 fill-amber-400' />
                <span>Principal AI Systems Architect • Medallion Lakehouses &amp; LLMOps • Founder @ Koom-AI</span>
            </p>

            <div className='small-screen'>
                <p>This portfolio is designed for desktop/tablet screens. You can also view it by selecting Chrome Desktop Version.</p>
            </div>
        </section>
    )
}

export default Welcome