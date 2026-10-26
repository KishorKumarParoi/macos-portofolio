import { locations } from '#constants'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import React, { useRef } from 'react'

const projects = Array.isArray(locations.work?.children) ? locations.work.children : []

// 🦅 Symmetrical Eagle Wing Desktop Formation (Staggered Dual-Column Flanks)
// Distributes all 15 project folders along left and right flanks with safe vertical clearances (>= 21vh per column)
// to completely prevent any folder data overlap, while keeping the center 100% clean and unobstructed.
const EAGLE_WING_POSITIONS = [
    // Left Wing (Projects 01 to 08: Staggered Dual-Column Flank)
    { top: '7.5vh',  left: '2.5vw',  wing: 'left' },   // 01 Outer
    { top: '17.5vh', left: '12vw',   wing: 'left' },   // 02 Inner
    { top: '28.5vh', left: '2.5vw',  wing: 'left' },   // 03 Outer
    { top: '39vh',   left: '12vw',   wing: 'left' },   // 04 Inner
    { top: '50vh',   left: '2.5vw',  wing: 'left' },   // 05 Outer
    { top: '60.5vh', left: '12vw',   wing: 'left' },   // 06 Inner
    { top: '71vh',   left: '2.5vw',  wing: 'left' },   // 07 Outer
    { top: '81.5vh', left: '12vw',   wing: 'left' },   // 08 Inner

    // Right Wing (Projects 09 to 15: Staggered Dual-Column Flank anchored to right edge)
    { top: '7.5vh',  right: '12vw',  wing: 'right' },  // 09 Inner
    { top: '17.5vh', right: '2.5vw',  wing: 'right' },  // 10 Outer
    { top: '28.5vh', right: '12vw',  wing: 'right' },  // 11 Inner
    { top: '39vh',   right: '2.5vw',  wing: 'right' },  // 12 Outer
    { top: '50vh',   right: '12vw',  wing: 'right' },  // 13 Inner
    { top: '60.5vh', right: '2.5vw',  wing: 'right' },  // 14 Outer
    { top: '71vh',   right: '12vw',  wing: 'right' },  // 15 Inner
]

const Home = () => {
    const { openWindow, focusWindow } = useWindowStore()
    const { setActiveLocation } = useLocationStore()
    const containerRef = useRef(null)

    const handleOpenProjectFinder = (project) => {
        if (!project) return
        setActiveLocation(project)
        openWindow('finder')
        focusWindow('finder')
    }

    useGSAP(() => {
        Draggable.create('.folder', {
            type: 'x,y',
            edgeResistance: 0.65,
            bounds: 'main',
            cursor: 'grab',
            activeCursor: 'grabbing',
            zIndexBoost: true,
            dragClickables: true,
            minimumMovement: 6,
            onClick: function (e) {
                const el = this.target?.closest?.('[data-project-id]') || this.target
                const id = el?.getAttribute?.('data-project-id')
                const proj = projects.find((p) => String(p.id) === String(id))
                if (proj) {
                    handleOpenProjectFinder(proj)
                }
            },
        })
    }, [])

    const resetEagleFormation = () => {
        const folders = document.querySelectorAll('.folder')
        folders.forEach((folder) => {
            gsap.to(folder, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
            })
        })
    }

    return (
        <section id='home' ref={containerRef} className='relative z-0'>
            {/* Desktop Quick Symmetrical Eagle Wings Formation Indicator */}
            <div className='hidden sm:flex fixed bottom-2 left-3 z-10 items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[10px] font-mono text-gray-300 opacity-60 hover:opacity-100 transition duration-300'>
                <span>🦅 Eagle Formation</span>
                <span className='text-gray-500'>•</span>
                <button
                    onClick={resetEagleFormation}
                    className='text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer'
                    title='Reset folders to symmetrical Eagle wing formation'
                >
                    Snap Wings
                </button>
            </div>

            {/* Desktop Eagle Wing Formation (Screens >= 640px) */}
            <ul className='hidden sm:block'>
                {projects.map((project, index) => {
                    const pos = EAGLE_WING_POSITIONS[index] || {
                        top: `${10 + (index % 8) * 10}vh`,
                        left: index < 8 ? '2.5vw' : undefined,
                        right: index >= 8 ? '2.5vw' : undefined,
                        wing: index < 8 ? 'left' : 'right',
                    }

                    // Format clean display name
                    const cleanName = project.name.replace(/^\d+\.\s*/, '')
                    const projectNum = String(index + 1).padStart(2, '0')

                    return (
                        <li
                            key={project.id}
                            data-project-id={project.id}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleOpenProjectFinder(project)
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation()
                                handleOpenProjectFinder(project)
                            }}
                            className={clsx(
                                'group folder absolute select-none flex items-center flex-col cursor-pointer transition-transform hover:scale-105 active:scale-95 touch-manipulation',
                                pos.wing === 'left' ? 'items-start sm:items-center' : 'items-end sm:items-center'
                            )}
                            style={{
                                top: pos.top,
                                ...(pos.left ? { left: pos.left } : {}),
                                ...(pos.right ? { right: pos.right } : {}),
                            }}
                            title={`${project.name} (Click or double-click to open in Finder)`}
                        >
                            <div className='relative flex flex-col items-center pointer-events-none'>
                                <div className='relative'>
                                    <img
                                        src='/images/folder.png'
                                        alt={project.name}
                                        className='size-12 drop-shadow-lg group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] transition duration-300 p-0.5'
                                    />
                                    <span className='absolute -top-1 -right-1 text-[9px] font-mono font-bold px-1 py-0.2 rounded-full bg-black/70 border border-cyan-400/40 text-cyan-300 backdrop-blur-xs'>
                                        {projectNum}
                                    </span>
                                </div>
                                <p className='text-[10px] sm:text-[10.5px] font-medium text-white text-center px-2 py-0.5 rounded-md mt-1 bg-black/45 group-hover:bg-blue-600/90 border border-white/10 group-hover:border-blue-400/60 shadow-md transition-colors w-28 max-w-[136px] line-clamp-3 leading-snug drop-shadow-md backdrop-blur-xs select-none'>
                                    {cleanName}
                                </p>
                            </div>
                        </li>
                    )
                })}
            </ul>

            {/* Mobile Touch-Optimized Project Grid (Screens < 640px) */}
            <div className='block sm:hidden fixed inset-x-0 top-12 bottom-20 px-3 overflow-y-auto z-10 pointer-events-auto'>
                <div className='flex items-center justify-between mb-2 px-2 text-[11px] font-mono text-cyan-300 bg-black/60 backdrop-blur-md py-1 rounded-lg border border-white/10'>
                    <span>📁 15 Featured Projects</span>
                    <span className='text-[10px] text-gray-400'>Tap to open</span>
                </div>
                <div className='grid grid-cols-3 gap-2.5 pb-6'>
                    {projects.map((project, index) => {
                        const cleanName = project.name.replace(/^\d+\.\s*/, '')
                        const projectNum = String(index + 1).padStart(2, '0')
                        return (
                            <div
                                key={`mob-${project.id}`}
                                onClick={() => handleOpenProjectFinder(project)}
                                className='flex flex-col items-center justify-center p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 active:scale-95 transition cursor-pointer text-center'
                            >
                                <div className='relative mb-1'>
                                    <img
                                        src='/images/folder.png'
                                        alt={project.name}
                                        className='size-10 drop-shadow-md'
                                    />
                                    <span className='absolute -top-1 -right-1 text-[8px] font-mono font-bold px-1 rounded-full bg-black/80 border border-cyan-400/50 text-cyan-300'>
                                        {projectNum}
                                    </span>
                                </div>
                                <p className='text-[10px] font-medium text-white line-clamp-2 leading-tight'>
                                    {cleanName}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Home