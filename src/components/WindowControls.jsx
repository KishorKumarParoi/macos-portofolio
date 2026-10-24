import useWindowStore from '#store/window'
import React from 'react'

const WindowControls = ({ target }) => {
    const { closeWindow, minimizeWindow, toggleMaximize } = useWindowStore();

    return (
        <div id='window-controls' className='flex items-center gap-1.5 cursor-pointer select-none'>
            <div 
                className='close' 
                title='Close window'
                onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(target);
                }} 
            />
            <div 
                className='minimize' 
                title='Minimize / Hide window'
                onClick={(e) => {
                    e.stopPropagation();
                    if (minimizeWindow) {
                        minimizeWindow(target);
                    } else {
                        closeWindow(target);
                    }
                }} 
            />
            <div 
                className='maximize' 
                title='Toggle Fullscreen / Maximize'
                onClick={(e) => {
                    e.stopPropagation();
                    if (toggleMaximize) {
                        toggleMaximize(target);
                    }
                }} 
            />
        </div>
    )
}

export default WindowControls