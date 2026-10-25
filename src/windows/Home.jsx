import { locations } from '#constants'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import React, { useRef } from 'react'

const projects = Array.isArray(locations.work?.children) ? locations.work.children : []

// 🦅 Symmetrical Eagle Wing Desktop Formation
// Distributes all 15 project folders serially along the left and right flanks,
// creating the silhouette of an Eagle in flight while keeping the center 100% clean and unobstructed.
const EAGLE_WING_POSITIONS = [
    // Left Wing (Projects 1 to 8: Outer soaring curve, tip to flank)
    { top: '8vh',  left: '2.5vw', wing: 'left',  label: 'Left Wing Tip (Upper)' },
    { top: '18vh', left: '6.5vw', wing: 'left',  label: 'Left Feather 1' },
    { top: '29vh', left: '11vw',  wing: 'left',  label: 'Left Feather 2' },
    { top: '40vh', left: '14.5vw', wing: 'left', label: 'Left Wing Crest' },
    { top: '51vh', left: '14.5vw', wing: 'left', label: 'Left Wing Joint' },
    { top: '62vh', left: '11vw',  wing: 'left',  label: 'Left Secondary' },
    { top: '72vh', left: '6.5vw', wing: 'left',  label: 'Left Lower Feather' },
    { top: '82vh', left: '2.5vw', wing: 'left',  label: 'Left Wing Flank' },

    // Right Wing (Projects 9 to 15: Mirroring soaring flank, tip to flank)
    { top: '8vh',  left: '91vw',  wing: 'right', label: 'Right Wing Tip (Upper)' },
    { top: '20vh', left: '87vw',  wing: 'right', label: 'Right Feather 1' },
    { top: '32vh', left: '82.5vw', wing: 'right', label: 'Right Feather 2' },
    { top: '45vh', left: '79vw',  wing: 'right', label: 'Right Wing Crest' },
    { top: '58vh', left: '82.5vw', wing: 'right', label: 'Right Secondary' },
    { top: '70vh', left: '87vw',  wing: 'right', label: 'Right Lower Feather' },
    { top: '82vh', left: '91vw',  wing: 'right', label: 'Right Wing Flank' },
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
            dragClickables: false,
            onClick: function () {
                const id = this.target.getAttribute('data-project-id')
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
        <section id='home' ref={containerRef} className='relative z-0 max-sm:hidden'>
            {/* Quick Symmetrical Eagle Wings Formation Indicator */}
            <div className='fixed bottom-2 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[10px] font-mono text-gray-300 opacity-60 hover:opacity-100 transition duration-300'>
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

            <ul>
                {projects.map((project, index) => {
                    const pos = EAGLE_WING_POSITIONS[index] || {
                        top: `${10 + (index % 8) * 10}vh`,
                        left: index < 8 ? '4vw' : '88vw',
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
                                'group folder absolute select-none flex items-center flex-col cursor-pointer transition-transform hover:scale-105 active:scale-95',
                                pos.wing === 'left' ? 'items-start sm:items-center' : 'items-end sm:items-center'
                            )}
                            style={{
                                top: pos.top,
                                left: pos.left,
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
                                <p className='text-[11px] font-medium text-white text-center px-1.5 py-0.5 rounded-md mt-1 group-hover:bg-blue-600/90 shadow-xs transition-colors max-w-[105px] line-clamp-2 leading-tight drop-shadow-md backdrop-blur-xs'>
                                    {cleanName}
                                </p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

export default Home