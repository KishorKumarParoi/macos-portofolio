import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import React, { useState, useEffect } from 'react'
import {
    ZoomIn,
    ZoomOut,
    RotateCcw,
    ExternalLink,
    Image as ImageIcon,
    Columns2,
    LayoutGrid,
    List,
    X,
    ChevronLeft,
    ChevronRight,
    Plus,
} from 'lucide-react'

const FALLBACK_IMAGE = '/images/macbook-wallpaper-sonoma-horizon.jpg'

const Image = () => {
    const { windows, closeWindow } = useWindowStore()
    const incomingData = windows.imgfile?.data

    // Multiple Images opened collection
    const [openedImages, setOpenedImages] = useState(() => {
        if (incomingData?.imageUrl) {
            return [{
                id: incomingData.id || Date.now(),
                name: incomingData.name || 'Architecture Diagram',
                imageUrl: incomingData.imageUrl,
            }]
        }
        return []
    })

    const [activeImageId, setActiveImageId] = useState(null)
    const [scale, setScale] = useState(1)
    const [viewMode, setViewMode] = useState('single') // 'single' | 'split' | 'grid'

    // When new image is opened from Finder, add to opened collection
    useEffect(() => {
        if (incomingData?.imageUrl) {
            setOpenedImages((prev) => {
                const existing = prev.find((img) => img.imageUrl === incomingData.imageUrl)
                if (existing) {
                    setActiveImageId(existing.id)
                    return prev
                }
                const newImg = {
                    id: incomingData.id || Date.now() + Math.random(),
                    name: incomingData.name || 'Architecture Diagram',
                    imageUrl: incomingData.imageUrl,
                }
                setActiveImageId(newImg.id)
                return [...prev, newImg]
            })
            setScale(1)
        }
    }, [incomingData])

    const activeImage = openedImages.find((img) => img.id === activeImageId) || openedImages[0]

    const handleCloseTab = (idToClose, e) => {
        e?.stopPropagation()
        const remaining = openedImages.filter((img) => img.id !== idToClose)
        setOpenedImages(remaining)
        if (remaining.length === 0) {
            closeWindow('imgfile')
        } else if (activeImageId === idToClose) {
            setActiveImageId(remaining[remaining.length - 1].id)
        }
    }

    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3))
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5))
    const handleReset = () => setScale(1)

    const handleNextImage = () => {
        if (openedImages.length <= 1) return
        const currentIndex = openedImages.findIndex((img) => img.id === activeImage?.id)
        const nextIndex = (currentIndex + 1) % openedImages.length
        setActiveImageId(openedImages[nextIndex].id)
        setScale(1)
    }

    const handlePrevImage = () => {
        if (openedImages.length <= 1) return
        const currentIndex = openedImages.findIndex((img) => img.id === activeImage?.id)
        const prevIndex = (currentIndex - 1 + openedImages.length) % openedImages.length
        setActiveImageId(openedImages[prevIndex].id)
        setScale(1)
    }

    if (openedImages.length === 0 && !incomingData) return null

    return (
        <div className='flex flex-col bg-white dark:bg-black text-gray-800 dark:text-gray-100 select-none overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl min-w-[340px] max-w-[96vw]'>
            {/* Window Header */}
            <div id='window-header' className='flex items-center justify-between px-3.5 py-2 bg-gray-50 dark:bg-[#0d0d12] border-b border-gray-200 dark:border-white/10'>
                <div className='flex items-center gap-2'>
                    <WindowControls target='imgfile' />
                    <div className='flex items-center gap-1.5 ml-2'>
                        <ImageIcon className='size-3.5 text-pink-500' />
                        <h2 className='text-xs font-bold text-gray-800 dark:text-white truncate max-w-[220px]'>
                            {activeImage?.name || 'macOS Preview'}
                        </h2>
                    </div>
                </div>

                {/* View Mode & Multi-Image Comparison Tools */}
                <div className='flex items-center gap-1'>
                    <div className='flex items-center gap-0.5 bg-gray-200 dark:bg-white/10 p-0.5 rounded-md text-[10px]'>
                        <button
                            onClick={() => setViewMode('single')}
                            className={`px-2 py-0.5 rounded transition cursor-pointer ${
                                viewMode === 'single' ? 'bg-white dark:bg-black text-blue-600 dark:text-cyan-300 font-bold shadow-xs' : 'text-gray-500 hover:text-white'
                            }`}
                            title='Single Image View'
                        >
                            Single
                        </button>
                        <button
                            onClick={() => setViewMode('split')}
                            disabled={openedImages.length < 2}
                            className={`px-2 py-0.5 rounded transition cursor-pointer disabled:opacity-30 ${
                                viewMode === 'split' ? 'bg-white dark:bg-black text-blue-600 dark:text-cyan-300 font-bold shadow-xs' : 'text-gray-500 hover:text-white'
                            }`}
                            title='Split Side-by-Side Dual View (Requires 2+ Open Images)'
                        >
                            <Columns2 className='size-3 inline mr-1' />
                            <span>Split</span>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-2 py-0.5 rounded transition cursor-pointer ${
                                viewMode === 'grid' ? 'bg-white dark:bg-black text-blue-600 dark:text-cyan-300 font-bold shadow-xs' : 'text-gray-500 hover:text-white'
                            }`}
                            title='Grid View of All Open Images'
                        >
                            <LayoutGrid className='size-3 inline mr-1' />
                            <span>Grid ({openedImages.length})</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-2 py-0.5 rounded transition cursor-pointer ${
                                viewMode === 'list' ? 'bg-white dark:bg-black text-blue-600 dark:text-cyan-300 font-bold shadow-xs' : 'text-gray-500 hover:text-white'
                            }`}
                            title='List View of All Open Images'
                        >
                            <List className='size-3 inline mr-1' />
                            <span>List</span>
                        </button>
                    </div>

                    {/* Navigation Buttons for Multiple Images */}
                    {openedImages.length > 1 && (
                        <div className='flex items-center gap-0.5 ml-1'>
                            <button
                                onClick={handlePrevImage}
                                className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition cursor-pointer'
                                title='Previous Image'
                            >
                                <ChevronLeft className='size-3.5' />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition cursor-pointer'
                                title='Next Image'
                            >
                                <ChevronRight className='size-3.5' />
                            </button>
                        </div>
                    )}

                    {/* Zoom & External Controls */}
                    {viewMode === 'single' && (
                        <div className='flex items-center gap-0.5 ml-1'>
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
                        </div>
                    )}

                    {activeImage?.imageUrl && (
                        <a
                            href={activeImage.imageUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition cursor-pointer ml-1'
                            title='Open Full Resolution Image in New Tab'
                        >
                            <ExternalLink className='size-3.5' />
                        </a>
                    )}
                </div>
            </div>

            {/* macOS Preview Multi-Image Tab Bar */}
            {openedImages.length > 0 && (
                <div className='flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-[#12131d] border-b border-gray-200 dark:border-white/10 overflow-x-auto text-xs no-scrollbar'>
                    {openedImages.map((img) => (
                        <div
                            key={img.id}
                            onClick={() => setActiveImageId(img.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition cursor-pointer ${
                                activeImage?.id === img.id
                                    ? 'bg-white dark:bg-black text-blue-600 dark:text-cyan-300 font-semibold shadow-xs border border-gray-300 dark:border-white/15'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'
                            }`}
                        >
                            <ImageIcon className='size-3 text-pink-400 shrink-0' />
                            <span className='truncate max-w-[120px]'>{img.name}</span>
                            <button
                                onClick={(e) => handleCloseTab(img.id, e)}
                                className='p-0.5 rounded-full hover:bg-gray-300 dark:hover:bg-white/20 text-gray-400 hover:text-white transition'
                                title='Close Image'
                            >
                                <X className='size-2.5' />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Display Body according to viewMode */}
            <div className={`p-4 bg-white dark:bg-black min-h-[320px] max-h-[72vh] overflow-y-auto ${viewMode === 'single' ? 'flex items-center justify-center' : 'block'}`}>
                {viewMode === 'single' && activeImage && (
                    /* Single Focused View with Zoom */
                    <div className='relative transition-transform duration-200 ease-out flex items-center justify-center w-full h-full' style={{ transform: `scale(${scale})` }}>
                        <img
                            src={activeImage.imageUrl}
                            alt={activeImage.name}
                            onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src = FALLBACK_IMAGE
                            }}
                            className='max-w-full max-h-[66vh] object-contain rounded-lg shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.8)]'
                        />
                    </div>
                )}

                {viewMode === 'split' && (
                    /* Side-by-Side Dual Comparison View */
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full'>
                        {openedImages.slice(0, 2).map((img, idx) => (
                            <div key={img.id} className='flex flex-col items-center bg-gray-50 dark:bg-[#0c0d14] p-3 rounded-xl border border-gray-200 dark:border-white/10'>
                                <div className='flex items-center justify-between w-full mb-2 text-xs font-mono text-gray-500 dark:text-gray-400 pb-1 border-b border-gray-200 dark:border-white/10'>
                                    <span className='truncate font-semibold'>Panel {idx + 1}: {img.name}</span>
                                    <a href={img.imageUrl} target='_blank' rel='noopener noreferrer' className='text-cyan-400 hover:underline flex items-center gap-1'>
                                        <span>Full</span>
                                        <ExternalLink className='size-3' />
                                    </a>
                                </div>
                                <img
                                    src={img.imageUrl}
                                    alt={img.name}
                                    onError={(e) => {
                                        e.currentTarget.onerror = null
                                        e.currentTarget.src = FALLBACK_IMAGE
                                    }}
                                    className='max-w-full max-h-[58vh] object-contain rounded'
                                />
                            </div>
                        ))}
                    </div>
                )}

                {viewMode === 'grid' && (
                    /* Multi-Image Grid View (Sequential Non-Overlapping) */
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 w-full auto-rows-max'>
                        {openedImages.map((img) => (
                            <div
                                key={img.id}
                                onClick={() => {
                                    setActiveImageId(img.id)
                                    setViewMode('single')
                                }}
                                className='p-2.5 rounded-xl bg-gray-50 dark:bg-[#0e0f18] border border-gray-200 dark:border-white/10 hover:border-cyan-400 transition cursor-pointer flex flex-col items-center group'
                            >
                                <div className='w-full flex items-center justify-between mb-1.5 text-[11px] font-mono text-gray-500 dark:text-gray-400'>
                                    <span className='truncate font-semibold group-hover:text-cyan-400 transition'>{img.name}</span>
                                    <button
                                        onClick={(e) => handleCloseTab(img.id, e)}
                                        className='p-0.5 rounded text-gray-400 hover:text-white'
                                    >
                                        <X className='size-3' />
                                    </button>
                                </div>
                                <div className='w-full h-36 flex items-center justify-center bg-black/40 rounded p-1 overflow-hidden'>
                                    <img
                                        src={img.imageUrl}
                                        alt={img.name}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null
                                            e.currentTarget.src = FALLBACK_IMAGE
                                        }}
                                        className='max-w-full max-h-full object-contain rounded group-hover:scale-105 transition'
                                    />
                                </div>
                                <span className='text-[10px] text-cyan-400 font-mono mt-1'>Click to Enlarge</span>
                            </div>
                        ))}
                    </div>
                )}

                {viewMode === 'list' && (
                    /* Multi-Image List View */
                    <div className='flex flex-col gap-2 w-full'>
                        {openedImages.map((img) => (
                            <div
                                key={img.id}
                                onClick={() => {
                                    setActiveImageId(img.id)
                                    setViewMode('single')
                                }}
                                className='flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-[#0e0f18] border border-gray-200 dark:border-white/10 hover:border-cyan-400 transition cursor-pointer group'
                            >
                                <div className='flex items-center gap-3 min-w-0'>
                                    <img
                                        src={img.imageUrl}
                                        alt={img.name}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null
                                            e.currentTarget.src = FALLBACK_IMAGE
                                        }}
                                        className='size-12 object-cover rounded-md bg-black/40 shrink-0'
                                    />
                                    <div className='min-w-0 flex flex-col'>
                                        <span className='text-xs font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-cyan-400 transition'>{img.name}</span>
                                        <span className='text-[10px] text-gray-400 font-mono truncate'>macOS Preview Asset • Click to Enlarge</span>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2 shrink-0'>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setActiveImageId(img.id)
                                            setViewMode('single')
                                        }}
                                        className='px-2 py-1 text-[10px] font-mono bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 dark:text-cyan-300 rounded transition'
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={(e) => handleCloseTab(img.id, e)}
                                        className='p-1 rounded text-gray-400 hover:text-white transition'
                                    >
                                        <X className='size-3.5' />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Status Bar */}
            <div className='flex items-center justify-between px-3 py-1 bg-gray-100/90 dark:bg-[#08080c] border-t border-gray-200 dark:border-white/10 text-[10px] text-gray-500 dark:text-gray-400 font-mono'>
                <span>{openedImages.length} Image{openedImages.length > 1 ? 's' : ''} Open Simultaneously • macOS Multi-Preview</span>
                <span>Mode: {viewMode.toUpperCase()} {viewMode === 'single' ? `• ${Math.round(scale * 100)}%` : ''}</span>
            </div>
        </div>
    )
}

const ImageWindow = WindowWrapper(Image, 'imgfile')

export default ImageWindow