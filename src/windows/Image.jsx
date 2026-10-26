import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import React, { useState } from 'react'
import { ZoomIn, ZoomOut, RotateCcw, ExternalLink, Image as ImageIcon } from 'lucide-react'

const FALLBACK_IMAGE = '/images/macbook-wallpaper-sonoma-horizon.jpg'

const Image = () => {
    const { windows } = useWindowStore()
    const data = windows.imgfile?.data
    const [scale, setScale] = useState(1)
    const [imgSrc, setImgSrc] = useState(data?.imageUrl || FALLBACK_IMAGE)

    React.useEffect(() => {
        if (data?.imageUrl) {
            setImgSrc(data.imageUrl)
            setScale(1)
        }
    }, [data?.imageUrl])

    if (!data) return null

    const { name } = data

    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3))
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5))
    const handleReset = () => setScale(1)

    return (
        <div className='flex flex-col bg-white dark:bg-black text-gray-800 dark:text-gray-100 select-none overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl'>
            <div id='window-header' className='flex items-center justify-between px-3.5 py-2 bg-gray-50 dark:bg-[#0d0d12] border-b border-gray-200 dark:border-white/10'>
                <div className='flex items-center gap-2'>
                    <WindowControls target='imgfile' />
                    <div className='flex items-center gap-1.5 ml-2'>
                        <ImageIcon className='size-3.5 text-pink-500' />
                        <h2 className='text-xs font-bold text-gray-800 dark:text-white truncate max-w-[280px]'>{name || 'Preview'}</h2>
                    </div>
                </div>

                <div className='flex items-center gap-1'>
                    <button
                        onClick={handleZoomOut}
                        className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition cursor-pointer'
                        title='Zoom Out'
                    >
                        <ZoomOut className='size-3.5' />
                    </button>
                    <span className='text-[10px] font-mono text-gray-500 dark:text-gray-400 min-w-8 text-center'>
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition cursor-pointer'
                        title='Zoom In'
                    >
                        <ZoomIn className='size-3.5' />
                    </button>
                    <button
                        onClick={handleReset}
                        className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition cursor-pointer'
                        title='Reset Zoom'
                    >
                        <RotateCcw className='size-3.5' />
                    </button>
                    <a
                        href={imgSrc}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition cursor-pointer ml-1'
                        title='Open Full Resolution Image in New Tab'
                    >
                        <ExternalLink className='size-3.5' />
                    </a>
                </div>
            </div>

            <div className='p-4 bg-white dark:bg-black flex items-center justify-center min-h-[340px] max-h-[75vh] overflow-auto'>
                <div className='relative transition-transform duration-200 ease-out' style={{ transform: `scale(${scale})` }}>
                    <img
                        src={imgSrc}
                        alt={name || 'Architecture Diagram'}
                        onError={() => setImgSrc(FALLBACK_IMAGE)}
                        className='max-w-full max-h-[68vh] object-contain rounded-lg shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.8)]'
                    />
                </div>
            </div>

            <div className='flex items-center justify-between px-3 py-1 bg-gray-100/90 dark:bg-[#08080c] border-t border-gray-200 dark:border-white/10 text-[10px] text-gray-500 dark:text-gray-400 font-mono'>
                <span>macOS Preview • High-Fidelity Rendering</span>
                <span>Zoom: {Math.round(scale * 100)}%</span>
            </div>
        </div>
    )
}

const ImageWindow = WindowWrapper(Image, 'imgfile')

export default ImageWindow