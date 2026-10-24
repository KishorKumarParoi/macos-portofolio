import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/all';
import React, { useLayoutEffect, useRef } from 'react'

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const win = windows[windowKey] || {};
        const { zIndex, isOpen, isMaximized } = win;
        const ref = useRef(null);
        const draggableInstanceRef = useRef(null);

        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            el.style.display = 'block';
        }, [isOpen])

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            const [instance] = Draggable.create(el, {
                bounds: 'main',
                onPress() {
                    focusWindow(windowKey);
                }
            });
            draggableInstanceRef.current = instance;

            return () => {
                instance.kill();
            }
        }, [])

        // Handle open/close transition
        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;

            el.style.display = isOpen ? 'block' : 'none';

            if (isOpen) {
                gsap.fromTo(el,
                    { scale: 0.85, opacity: 0, y: 30 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.15, ease: 'power3.out' }
                )
            }
        }, [isOpen])

        // Handle Maximize / Fullscreen transition
        useLayoutEffect(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            if (isMaximized) {
                if (draggableInstanceRef.current) {
                    draggableInstanceRef.current.disable();
                }
                gsap.to(el, {
                    top: 28,
                    left: 0,
                    x: 0,
                    y: 0,
                    width: '100vw',
                    height: 'calc(100vh - 90px)',
                    borderRadius: '0px',
                    duration: 0.22,
                    ease: 'power3.out'
                });
            } else {
                if (draggableInstanceRef.current) {
                    draggableInstanceRef.current.enable();
                }
                gsap.to(el, {
                    width: '',
                    height: '',
                    top: '',
                    left: '',
                    borderRadius: '',
                    duration: 0.2,
                    ease: 'power3.out'
                });
            }
        }, [isMaximized, isOpen]);

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className={`absolute transition-shadow ${isMaximized ? 'shadow-none' : 'shadow-2xl'}`}
            >
                <Component {...props} isMaximized={isMaximized} />
            </section>
        )
    }

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;
    return Wrapped;
}

export default WindowWrapper