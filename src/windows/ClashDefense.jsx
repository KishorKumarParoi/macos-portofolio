import React, { useState, useEffect, useRef } from 'react'
import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import { Shield, Swords, Zap, Crosshair, Award, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react'

// Synthesizer SFX
const playSound = (type) => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (!AudioCtx) return
        const ctx = new AudioCtx()

        if (type === 'cannon') {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(140, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.35)
            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start()
            osc.stop(ctx.currentTime + 0.35)
        } else if (type === 'arrow') {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(800, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)
            gain.gain.setValueAtTime(0.18, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start()
            osc.stop(ctx.currentTime + 0.15)
        } else if (type === 'wizard') {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sawtooth'
            osc.frequency.setValueAtTime(400, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25)
            gain.gain.setValueAtTime(0.2, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start()
            osc.stop(ctx.currentTime + 0.25)
        } else if (type === 'victory') {
            [261.63, 329.63, 392.00, 523.25].forEach((freq, idx) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()
                osc.type = 'triangle'
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12)
                gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12)
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.4)
                osc.connect(gain)
                gain.connect(ctx.destination)
                osc.start(ctx.currentTime + idx * 0.12)
                osc.stop(ctx.currentTime + idx * 0.12 + 0.4)
            })
        }
    } catch (e) {}
}

const ClashDefense = () => {
    const canvasRef = useRef(null)
    const { closeWindow } = useWindowStore()
    const [gameState, setGameState] = useState('permission') // permission | playing | won | lost
    const [score, setScore] = useState(0)
    const [gold, setGold] = useState(350)
    const [elixir, setElixir] = useState(250)
    const [timeLeft, setTimeLeft] = useState(60)
    const [wave, setWave] = useState(1)
    const [selectedDefense, setSelectedDefense] = useState('cannon')
    const [soundEnabled, setSoundEnabled] = useState(false)

    const gameRef = useRef({
        townHall: { x: 375, y: 250, hp: 1200, maxHp: 1200, radius: 36 },
        defenses: [
            { type: 'cannon', x: 280, y: 190, range: 130, damage: 35, fireRate: 900, lastFired: 0, level: 1 },
            { type: 'archer', x: 470, y: 190, range: 160, damage: 20, fireRate: 500, lastFired: 0, level: 1 },
            { type: 'wizard', x: 375, y: 340, range: 140, damage: 45, fireRate: 1200, lastFired: 0, level: 1 },
        ],
        enemies: [],
        projectiles: [],
        particles: [],
        floatingTexts: [],
        nextSpawnTime: 0,
        running: false,
    })

    const resetGame = () => {
        gameRef.current = {
            townHall: { x: 375, y: 250, hp: 1200, maxHp: 1200, radius: 36 },
            defenses: [
                { type: 'cannon', x: 280, y: 190, range: 130, damage: 35, fireRate: 900, lastFired: 0, level: 1 },
                { type: 'archer', x: 470, y: 190, range: 160, damage: 20, fireRate: 500, lastFired: 0, level: 1 },
                { type: 'wizard', x: 375, y: 340, range: 140, damage: 45, fireRate: 1200, lastFired: 0, level: 1 },
            ],
            enemies: [],
            projectiles: [],
            particles: [],
            floatingTexts: [],
            nextSpawnTime: 0,
            running: true,
        }
        setGold(350)
        setElixir(250)
        setTimeLeft(60)
        setWave(1)
        setScore(0)
        setGameState('playing')
    }

    // Canvas click to place defense
    const handleCanvasClick = (e) => {
        if (gameState !== 'playing') return
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0))
        const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : 0))
        const scaleX = canvas.width / (rect.width || 1)
        const scaleY = canvas.height / (rect.height || 1)
        const clickX = (clientX - rect.left) * scaleX
        const clickY = (clientY - rect.top) * scaleY

        // Distance to Town Hall check
        const distToTh = Math.hypot(clickX - gameRef.current.townHall.x, clickY - gameRef.current.townHall.y)
        if (distToTh < 60) return

        // Cost check
        const costs = { cannon: { gold: 120, elixir: 0 }, archer: { gold: 150, elixir: 50 }, wizard: { gold: 200, elixir: 120 } }
        const cost = costs[selectedDefense]
        if (gold < cost.gold || elixir < cost.elixir) return

        // Place defense
        const newDefense = {
            type: selectedDefense,
            x: clickX,
            y: clickY,
            range: selectedDefense === 'archer' ? 160 : selectedDefense === 'cannon' ? 130 : 140,
            damage: selectedDefense === 'archer' ? 22 : selectedDefense === 'cannon' ? 38 : 50,
            fireRate: selectedDefense === 'archer' ? 500 : selectedDefense === 'cannon' ? 900 : 1200,
            lastFired: 0,
            level: 1,
        }
        gameRef.current.defenses.push(newDefense)
        setGold((prev) => prev - cost.gold)
        setElixir((prev) => prev - cost.elixir)
    }

    // Main Game Loop
    useEffect(() => {
        if (gameState !== 'playing') {
            gameRef.current.running = false
            return
        }
        gameRef.current.running = true
        let animationFrameId
        let lastTime = performance.now()

        // 1-second countdown clock
        const timerInterval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setGameState('won')
                    if (soundEnabled) playSound('victory')
                    return 0
                }
                return prev - 1
            })
            // Passive income
            setGold((g) => g + 10)
            setElixir((e) => e + 8)
        }, 1000)

        const loop = (currentTime) => {
            const dt = currentTime - lastTime
            lastTime = currentTime

            const canvas = canvasRef.current
            if (canvas && gameRef.current.running) {
                const ctx = canvas.getContext('2d')
                const game = gameRef.current

                // 1. Spawning Enemies
                if (currentTime > game.nextSpawnTime && gameState === 'playing') {
                    const spawnDist = 450
                    const angle = Math.random() * Math.PI * 2
                    const spawnX = game.townHall.x + Math.cos(angle) * spawnDist
                    const spawnY = game.townHall.y + Math.sin(angle) * spawnDist

                    const types = ['barbarian', 'goblin', 'giant']
                    const randType = types[Math.floor(Math.random() * types.length)]
                    const enemyConfig = {
                        barbarian: { hp: 110, speed: 1.1, damage: 18, radius: 13, color: '#f59e0b', goldDrop: 30 },
                        goblin: { hp: 70, speed: 1.9, damage: 14, radius: 10, color: '#10b981', goldDrop: 45 },
                        giant: { hp: 380, speed: 0.6, damage: 40, radius: 18, color: '#ea580c', goldDrop: 75 },
                    }[randType]

                    game.enemies.push({
                        ...enemyConfig,
                        type: randType,
                        x: spawnX,
                        y: spawnY,
                        maxHp: enemyConfig.hp,
                        lastAttack: 0,
                    })

                    // Spawn delay gets faster over time
                    const interval = Math.max(1200, 3200 - (60 - timeLeft) * 35)
                    game.nextSpawnTime = currentTime + interval
                }

                // 2. Clear canvas
                ctx.fillStyle = '#0f172a'
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // Grid background
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
                ctx.lineWidth = 1
                for (let x = 0; x < canvas.width; x += 40) {
                    ctx.beginPath()
                    ctx.moveTo(x, 0)
                    ctx.lineTo(x, canvas.height)
                    ctx.stroke()
                }
                for (let y = 0; y < canvas.height; y += 40) {
                    ctx.beginPath()
                    ctx.moveTo(0, y)
                    ctx.lineTo(canvas.width, y)
                    ctx.stroke()
                }

                // Defense Range Circles
                game.defenses.forEach((def) => {
                    ctx.beginPath()
                    ctx.arc(def.x, def.y, def.range, 0, Math.PI * 2)
                    ctx.fillStyle = def.type === 'cannon' ? 'rgba(239, 68, 68, 0.04)' : def.type === 'archer' ? 'rgba(59, 130, 246, 0.04)' : 'rgba(168, 85, 247, 0.04)'
                    ctx.fill()
                    ctx.strokeStyle = def.type === 'cannon' ? 'rgba(239, 68, 68, 0.15)' : def.type === 'archer' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(168, 85, 247, 0.15)'
                    ctx.stroke()
                })

                // 3. Draw Town Hall
                const th = game.townHall
                ctx.beginPath()
                ctx.arc(th.x, th.y, th.radius, 0, Math.PI * 2)
                ctx.fillStyle = '#dc2626'
                ctx.fill()
                ctx.lineWidth = 3
                ctx.strokeStyle = '#fef08a'
                ctx.stroke()

                // TH Roof & Core
                ctx.fillStyle = '#7f1d1d'
                ctx.fillRect(th.x - 18, th.y - 18, 36, 36)
                ctx.fillStyle = '#fef08a'
                ctx.font = 'bold 12px sans-serif'
                ctx.textAlign = 'center'
                ctx.fillText('TH 12', th.x, th.y + 4)

                // Town Hall Health Bar
                const thHpRatio = Math.max(0, th.hp / th.maxHp)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
                ctx.fillRect(th.x - 30, th.y - 48, 60, 7)
                ctx.fillStyle = thHpRatio > 0.4 ? '#22c55e' : '#ef4444'
                ctx.fillRect(th.x - 30, th.y - 48, 60 * thHpRatio, 7)

                // 4. Update & Draw Defenses
                game.defenses.forEach((def) => {
                    // Find nearest enemy in range
                    let target = null
                    let minDist = def.range

                    game.enemies.forEach((enemy) => {
                        const d = Math.hypot(enemy.x - def.x, enemy.y - def.y)
                        if (d < minDist) {
                            minDist = d
                            target = enemy
                        }
                    })

                    // Fire Projectile
                    if (target && currentTime - def.lastFired > def.fireRate && gameState === 'playing') {
                        def.lastFired = currentTime
                        game.projectiles.push({
                            x: def.x,
                            y: def.y,
                            targetX: target.x,
                            targetY: target.y,
                            speed: def.type === 'archer' ? 6.5 : def.type === 'cannon' ? 5.5 : 4.5,
                            damage: def.damage,
                            type: def.type,
                            color: def.type === 'cannon' ? '#f97316' : def.type === 'archer' ? '#38bdf8' : '#c084fc',
                        })
                        if (soundEnabled) playSound(def.type)
                    }

                    // Render Defense Structure
                    ctx.beginPath()
                    ctx.arc(def.x, def.y, 16, 0, Math.PI * 2)
                    ctx.fillStyle = def.type === 'cannon' ? '#475569' : def.type === 'archer' ? '#0284c7' : '#7e22ce'
                    ctx.fill()
                    ctx.strokeStyle = '#f8fafc'
                    ctx.lineWidth = 2
                    ctx.stroke()

                    // Defense label
                    ctx.fillStyle = '#ffffff'
                    ctx.font = 'bold 9px sans-serif'
                    ctx.fillText(def.type === 'cannon' ? '💣' : def.type === 'archer' ? '🏹' : '⚡', def.x, def.y + 3)
                })

                // 5. Update & Draw Projectiles
                for (let i = game.projectiles.length - 1; i >= 0; i--) {
                    const p = game.projectiles[i]
                    const dx = p.targetX - p.x
                    const dy = p.targetY - p.y
                    const dist = Math.hypot(dx, dy)

                    if (dist < 8) {
                        // Impact damage to nearby enemies
                        game.enemies.forEach((enemy) => {
                            const hitDist = Math.hypot(enemy.x - p.x, enemy.y - p.y)
                            if (hitDist < (p.type === 'wizard' ? 38 : 18)) {
                                enemy.hp -= p.damage
                            }
                        })
                        game.projectiles.splice(i, 1)
                        continue
                    }

                    p.x += (dx / dist) * p.speed
                    p.y += (dy / dist) * p.speed

                    ctx.beginPath()
                    ctx.arc(p.x, p.y, p.type === 'wizard' ? 5 : 3.5, 0, Math.PI * 2)
                    ctx.fillStyle = p.color
                    ctx.fill()
                }

                // 6. Update & Draw Enemies
                for (let i = game.enemies.length - 1; i >= 0; i--) {
                    const enemy = game.enemies[i]

                    // Move toward Town Hall
                    const dx = game.townHall.x - enemy.x
                    const dy = game.townHall.y - enemy.y
                    const distToTh = Math.hypot(dx, dy)

                    if (distToTh < game.townHall.radius + enemy.radius) {
                        // Attack Town Hall
                        if (currentTime - enemy.lastAttack > 1000 && gameState === 'playing') {
                            enemy.lastAttack = currentTime
                            game.townHall.hp -= enemy.damage
                            if (game.townHall.hp <= 0) {
                                setGameState('lost')
                            }
                        }
                    } else {
                        enemy.x += (dx / distToTh) * enemy.speed
                        enemy.y += (dy / distToTh) * enemy.speed
                    }

                    // Check if dead
                    if (enemy.hp <= 0) {
                        setGold((g) => g + enemy.goldDrop)
                        setScore((s) => s + enemy.goldDrop * 2)
                        game.enemies.splice(i, 1)
                        continue
                    }

                    // Render Enemy
                    ctx.beginPath()
                    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2)
                    ctx.fillStyle = enemy.color
                    ctx.fill()
                    ctx.strokeStyle = '#ffffff'
                    ctx.lineWidth = 1.5
                    ctx.stroke()

                    // Enemy HP bar
                    const hpRatio = enemy.hp / enemy.maxHp
                    ctx.fillStyle = 'rgba(0,0,0,0.6)'
                    ctx.fillRect(enemy.x - 12, enemy.y - enemy.radius - 8, 24, 4)
                    ctx.fillStyle = '#ef4444'
                    ctx.fillRect(enemy.x - 12, enemy.y - enemy.radius - 8, 24 * hpRatio, 4)
                }
            }

            animationFrameId = requestAnimationFrame(loop)
        }

        animationFrameId = requestAnimationFrame(loop)

        return () => {
            gameRef.current.running = false
            cancelAnimationFrame(animationFrameId)
            clearInterval(timerInterval)
        }
    }, [gameState, soundEnabled])

    return (
        <div className='flex flex-col w-[760px] max-w-[96vw] bg-[#0b0f19] text-white rounded-xl shadow-2xl border border-white/20 select-none overflow-hidden'>
            {/* Window Header */}
            <div id='window-header' className='bg-[#131b2e] px-4 py-2.5 border-b border-white/10 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <WindowControls target='clash' />
                    <div className='flex items-center gap-2 ml-2'>
                        <Swords className='size-4 text-red-400' />
                        <span className='font-bold text-xs text-white'>Clash Village Defense RTS</span>
                        <span className='text-[10px] text-amber-300 font-mono'>Town Hall 12</span>
                    </div>
                </div>

                <div className='flex items-center gap-3 text-xs'>
                    <div className='flex items-center gap-1 font-mono text-amber-300'>
                        <span>🟡 Gold:</span>
                        <span className='font-bold'>{gold}</span>
                    </div>
                    <div className='flex items-center gap-1 font-mono text-purple-300'>
                        <span>🟣 Elixir:</span>
                        <span className='font-bold'>{elixir}</span>
                    </div>
                    <div className='flex items-center gap-1 font-mono text-emerald-300'>
                        <span>⏱️ {timeLeft}s</span>
                    </div>
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className='p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer'
                        title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
                    >
                        {soundEnabled ? <Volume2 className='size-3.5 text-cyan-400' /> : <VolumeX className='size-3.5 text-gray-500' />}
                    </button>
                </div>
            </div>

            {/* Defense Selector Bar */}
            <div className='bg-[#162035] px-4 py-2 flex items-center justify-between border-b border-white/10 text-xs'>
                <div className='flex items-center gap-2'>
                    <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>Build Defense:</span>
                    <button
                        onClick={() => setSelectedDefense('cannon')}
                        className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                            selectedDefense === 'cannon' ? 'bg-red-600 text-white font-bold shadow-xs' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                        }`}
                    >
                        <span>💣 Cannon</span>
                        <span className='text-[10px] text-amber-300 font-mono'>(120g)</span>
                    </button>
                    <button
                        onClick={() => setSelectedDefense('archer')}
                        className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                            selectedDefense === 'archer' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                        }`}
                    >
                        <span>🏹 Archer Tower</span>
                        <span className='text-[10px] text-amber-300 font-mono'>(150g)</span>
                    </button>
                    <button
                        onClick={() => setSelectedDefense('wizard')}
                        className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                            selectedDefense === 'wizard' ? 'bg-purple-600 text-white font-bold shadow-xs' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                        }`}
                    >
                        <span>⚡ Wizard Tower</span>
                        <span className='text-[10px] text-purple-300 font-mono'>(200g, 120e)</span>
                    </button>
                </div>

                <div className='flex items-center gap-2 text-[11px] font-mono text-gray-300'>
                    <span>Score: <strong className='text-amber-300'>{score}</strong></span>
                    <button
                        onClick={resetGame}
                        className='p-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer'
                        title='Restart Game'
                    >
                        <RotateCcw className='size-3.5' />
                    </button>
                </div>
            </div>

            {/* Game Canvas Container */}
            <div className='relative w-full h-[500px] bg-[#0f172a] overflow-hidden flex items-center justify-center cursor-crosshair'>
                <canvas
                    ref={canvasRef}
                    width={750}
                    height={500}
                    onClick={handleCanvasClick}
                    onTouchStart={handleCanvasClick}
                    className='w-full h-full touch-none'
                />

                {/* Permission Required Modal */}
                {gameState === 'permission' && (
                    <div className='absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 z-20'>
                        <Shield className='size-14 text-amber-400 mb-2 animate-pulse' />
                        <h2 className='text-2xl font-black text-amber-300'>CLASH OF VILLAGES: RTS DEFENSE</h2>
                        <p className='text-xs text-gray-300 mt-2 max-w-md leading-relaxed'>
                            Incoming hordes of Goblins, Barbarians, and Giants are marching toward Town Hall 12!
                            Place Cannons, Archer Towers, and Wizard Spires on the map to defend your village.
                        </p>
                        <div className='mt-3 flex items-center gap-2 text-[11px] text-amber-200/90 font-mono bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-lg'>
                            <span>⚠️ Permission Required: Start Village Battle Simulation?</span>
                        </div>
                        <div className='mt-5 flex items-center gap-3'>
                            <button
                                onClick={resetGame}
                                className='px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-xl transition transform hover:scale-105 cursor-pointer flex items-center gap-2'
                            >
                                <Swords className='size-4' />
                                <span>Grant Permission &amp; Start Battle ⚔️</span>
                            </button>
                            <button
                                onClick={() => closeWindow('clash')}
                                className='px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-medium text-xs rounded-xl border border-white/10 transition cursor-pointer'
                            >
                                Keep Village Safe / Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {/* Victory Modal */}
                {gameState === 'won' && (
                    <div className='absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300'>
                        <Award className='size-16 text-amber-400 mb-2 animate-bounce' />
                        <h2 className='text-2xl font-black text-amber-300'>VICTORY! VILLAGE SAVED! 🎉</h2>
                        <p className='text-sm text-gray-300 mt-1 max-w-md'>
                            You survived the relentless wave of Barbarians, Goblins, and Giants! Town Hall 12 stands undefeated!
                        </p>
                        <p className='mt-2 font-mono text-lg font-bold text-emerald-400'>Final Score: {score} PTS</p>
                        <button
                            onClick={resetGame}
                            className='mt-4 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold rounded-xl shadow-lg transition cursor-pointer'
                        >
                            Play Again ⚔️
                        </button>
                    </div>
                )}

                {/* Defeat Modal */}
                {gameState === 'lost' && (
                    <div className='absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300'>
                        <Swords className='size-16 text-red-500 mb-2 animate-pulse' />
                        <h2 className='text-2xl font-black text-red-400'>TOWN HALL DESTROYED! 💀</h2>
                        <p className='text-sm text-gray-300 mt-1 max-w-md'>
                            The enemy breached the inner perimeter! Place more Cannons and Wizard towers to defend!
                        </p>
                        <button
                            onClick={resetGame}
                            className='mt-4 px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg transition cursor-pointer'
                        >
                            Retry Defense 🛡️
                        </button>
                    </div>
                )}
            </div>

            {/* Tactical Footer Guide */}
            <div className='bg-[#131b2e] px-4 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400'>
                <span>💡 Click anywhere on the map outside Town Hall to place your selected defense tower.</span>
                <span className='font-mono text-amber-300'>Survive 60s to Win</span>
            </div>
        </div>
    )
}

const ClashDefenseWindow = WindowWrapper(ClashDefense, 'clash')
export default ClashDefenseWindow
