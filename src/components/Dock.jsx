import { dockApps, locations } from '#constants'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef, useState } from 'react'
import { Tooltip } from 'react-tooltip'

const Dock = () => {
    const { openWindow, closeWindow, windows } = useWindowStore()
    const { setActiveLocation } = useLocationStore();

    const dockRef = useRef(null)

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll('.dock-icon');
        const animateIcons = (mouseX) => {
            const { left } = dock.getBoundingClientRect();

            icons.forEach((icon) => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 2.5) / 20000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -20 * intensity,
                    duration: 0.25,
                    ease: 'power1.out',
                });
            })
        }

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundingClientRect();
            animateIcons(e.clientX - left);
        }

        const resetIcons = () => {
            icons.forEach((icon) =>
                gsap.to(icon, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power1.out"
                }),)
        }

        dock.addEventListener('mousemove', handleMouseMove);
        dock.addEventListener('mouseleave', resetIcons);

        return () => {
            dock.removeEventListener('mousemove', handleMouseMove);
            dock.removeEventListener('mouseleave', resetIcons);
        }
    }, [])

    const toggleApp = (app) => {
        if (!app.canOpen) return;

        const window = windows[app.id];

        if (!window) {
            console.error("Window not found for app: ", app.id);
            return
        }

        if (window && window.isOpen) {
            closeWindow(app.id);
        } else {
            if (app.id === 'trash') {
                setActiveLocation(locations?.trash);
                openWindow('finder');
                return;
            }
            else if (app.id === 'photos') {
                setActiveLocation(locations?.gallery);
                openWindow('finder');
                return;
            }

            openWindow(app.id);
        }

        console.log(windows);
    }

    const [isHovered, setIsHovered] = useState(false)
    const [isPinned, setIsPinned] = useState(false)

    return (
        <>
            {/* Bottom Screen Hover Sensor Zone (macOS Dock Trigger) */}
            <div
                className='fixed bottom-0 left-0 right-0 h-16 z-40 pointer-events-auto'
                onMouseEnter={() => setIsHovered(true)}
            />

            <section
                id='dock'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`transition-all duration-300 ease-out ${
                    isHovered || isPinned
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-[calc(100%-8px)] opacity-60 hover:opacity-100'
                }`}
            >
                <div ref={dockRef} className='dock-container relative'>
                    {/* Auto-Hide Indicator / Pin Toggle */}
                    <button
                        onClick={() => setIsPinned(!isPinned)}
                        className='absolute -top-6 right-3 text-[10px] bg-black/60 hover:bg-black/90 text-gray-300 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 transition flex items-center gap-1 shadow-xs'
                        title={isPinned ? 'Click to enable Auto-Hide' : 'Click to Pin Dock'}
                    >
                        <span>{isPinned ? '📌 Pinned' : '👁️ Auto-Hide'}</span>
                    </button>

                    {
                        dockApps.map(({ id, name, icon, canOpen }) => (
                            <div key={id} className='relative flex justify-center'>
                                <button
                                    type='button'
                                    className='dock-icon'
                                    aria-label={name}
                                    data-tooltip-id="dock-tooltip"
                                    data-tooltip-content={name}
                                    data-tooltip-delay-show={150}
                                    disabled={!canOpen}
                                    onClick={() => toggleApp({ id, canOpen })}
                                >
                                    <img
                                        src={`/images/${icon}`}
                                        alt={name}
                                        loading='lazy'
                                        className={canOpen ? '' : 'opacity-60'}
                                    />
                                </button>
                            </div>
                        ))
                    }
                </div>
                <Tooltip id="dock-tooltip" place="top" className="tooltip" />
            </section>
        </>
    )
}

export default Dock