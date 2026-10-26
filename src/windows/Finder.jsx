import { WindowControls } from '#components'
import { locations } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import clsx from 'clsx'
import { ArrowLeft, SearchIcon, List } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

const Finder = ({ isMaximized }) => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();

    // Resizable middle border line (sidebar width)
    const [sidebarWidth, setSidebarWidth] = useState(() => {
        if (typeof window === 'undefined') return 200;
        const saved = localStorage.getItem('macos_finder_sidebar_w');
        const parsed = parseInt(saved, 10);
        return !isNaN(parsed) && parsed >= 130 && parsed <= 380 ? parsed : 200;
    });

    // Resizable Finder Window Dimensions (Screen Size)
    const [finderSize, setFinderSize] = useState(() => {
        if (typeof window === 'undefined') return { width: 820, height: 520 };
        const savedW = parseInt(localStorage.getItem('macos_finder_w'), 10);
        const savedH = parseInt(localStorage.getItem('macos_finder_h'), 10);
        return {
            width: !isNaN(savedW) && savedW >= 500 ? savedW : 820,
            height: !isNaN(savedH) && savedH >= 340 ? savedH : 520,
        };
    });

    const isResizingSidebar = useRef(false);
    const isResizingWindow = useRef(false);

    // Sidebar Middle Border Resizing Handler
    const handleSidebarResizeStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizingSidebar.current = true;
        const startX = e.clientX;
        const startW = sidebarWidth;

        const onMouseMove = (moveEvent) => {
            if (!isResizingSidebar.current) return;
            const delta = moveEvent.clientX - startX;
            const newW = Math.max(130, Math.min(startW + delta, 380));
            setSidebarWidth(newW);
            localStorage.setItem('macos_finder_sidebar_w', newW.toString());
        };

        const onMouseUp = () => {
            isResizingSidebar.current = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    // Finder Window Bottom-Right Corner Resizing Handler
    const handleWindowResizeStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizingWindow.current = true;
        const startX = e.clientX;
        const startY = e.clientY;
        const startW = finderSize.width;
        const startH = finderSize.height;

        const onMouseMove = (moveEvent) => {
            if (!isResizingWindow.current) return;
            const newW = Math.max(480, Math.min(startW + (moveEvent.clientX - startX), window.innerWidth - 30));
            const newH = Math.max(340, Math.min(startH + (moveEvent.clientY - startY), window.innerHeight - 80));
            setFinderSize({ width: newW, height: newH });
            localStorage.setItem('macos_finder_w', newW.toString());
            localStorage.setItem('macos_finder_h', newH.toString());
        };

        const onMouseUp = () => {
            isResizingWindow.current = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const openItem = (item) => {
        if (!item) return;
        if (item.windowKey) return openWindow(item.windowKey);
        if (item.fileType === 'pdf') return openWindow("resume");
        if (item.kind === 'folder') {
            // Keep reference to parent for seamless back navigation
            const folderWithParent = { ...item, _parent: activeLocation };
            return setActiveLocation(folderWithParent);
        }

        if (["fig", "url"].includes(item.fileType) && item.href)
            return window.open(item.href, '_blank');

        if (["txt", "md"].includes(item.fileType))
            return openWindow('txtfile', item);

        if (["png", "jpg", "jpeg", "webp", "gif"].includes(item.fileType) || item.fileType === 'img')
            return openWindow('imgfile', item);

        openWindow(`${item.fileType}${item.kind}`, item);
    }

    const getItemKind = (item) => {
        if (item.kind === 'folder') return 'Folder';
        if (item.fileType === 'pdf') return 'PDF Document';
        if (item.fileType === 'url') return 'Web Link / Repository';
        if (item.fileType === 'img') return 'Image Document';
        if (item.name?.endsWith('.docx')) return 'Word Document';
        if (item.name?.endsWith('.tex')) return 'LaTeX Source';
        if (item.name?.endsWith('.md') || item.fileType === 'md') return 'Markdown Document';
        if (item.fileType === 'txt') return 'Plain Text Document';
        return 'Document';
    }

    const getItemSize = (item) => {
        if (item.size) return item.size;
        if (item.kind === 'folder') return `${item.children?.length || 0} items`;
        if (item.fileType === 'pdf') return '1.4 MB';
        if (item.fileType === 'img') return '420 KB';
        return '4.8 KB';
    }

    const getItemDate = (item) => {
        if (item.date) return item.date;
        return 'Oct 26, 2026';
    }

    const renderList = (name, items) => (
        <div>
            <h3>{name}</h3>
            <ul>
                {items.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => setActiveLocation(item)}
                        className={clsx(
                            item.type === activeLocation?.type && item.name === activeLocation?.name
                                ? "active"
                                : "not-active"
                        )}
                    >
                        <img src={item.icon} className='w-4' alt={item.name} />
                        <p className='text-sm font-medium truncate'>{item.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        <div 
            className='relative flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl transition-all'
            style={{
                width: isMaximized ? '100%' : `${finderSize.width}px`,
                height: isMaximized ? '100%' : `${finderSize.height}px`,
            }}
        >
            {/* Finder Header Bar */}
            <div id='window-header' className='shrink-0'>
                <div className='flex items-center gap-2'>
                    <WindowControls target="finder" />
                    {activeLocation?._parent && (
                        <button
                            onClick={() => setActiveLocation(activeLocation._parent)}
                            className='p-1 rounded hover:bg-gray-200/60 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition flex items-center ml-2 cursor-pointer'
                            title='Back'
                        >
                            <ArrowLeft className='size-3.5' />
                        </button>
                    )}
                    <span className='window-title font-medium truncate max-w-[240px] text-gray-800 dark:text-gray-200 text-xs ml-1'>
                        {activeLocation?.name ? `Finder — ${activeLocation.name}` : "Finder"}
                    </span>
                </div>

                {/* View Mode: List View Only */}
                <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-200/80 dark:bg-gray-800 text-[11px] font-medium text-gray-700 dark:text-gray-300 select-none shadow-xs'>
                    <List className='size-3.5 text-blue-500' />
                    <span>List</span>
                </div>

                <SearchIcon className='icon' />
            </div>

            {/* Mobile Quick Location Chips */}
            <div className='flex sm:hidden overflow-x-auto gap-1.5 px-3 py-1.5 bg-gray-100/90 dark:bg-black border-b border-gray-200 dark:border-white/10 text-xs shrink-0'>
                {Object.values(locations).map((loc) => (
                    <button
                        key={loc.id}
                        onClick={() => setActiveLocation(loc)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition cursor-pointer ${
                            activeLocation?.name === loc.name ? 'bg-blue-600 text-white font-bold' : 'bg-white dark:bg-[#101016] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 shadow-xs'
                        }`}
                    >
                        <img src={loc.icon} alt={loc.name} className='size-3' />
                        <span>{loc.name}</span>
                    </button>
                ))}
            </div>

            {/* Finder Body with Resizable Middle Border Divider */}
            <div className='bg-white dark:bg-black flex flex-1 min-h-0 overflow-hidden'>
                {/* Sidebar with dynamically adjustable width */}
                <div 
                    className='sidebar hidden sm:flex dark:bg-[#050508] shrink-0 overflow-y-auto'
                    style={{ width: `${sidebarWidth}px` }}
                >
                    {renderList("Favorites", Object.values(locations))}
                    {renderList("Work", locations.work.children)}
                </div>

                {/* 🪟 Resizable Middle Border Separator Line */}
                <div
                    onMouseDown={handleSidebarResizeStart}
                    onDoubleClick={() => setSidebarWidth(200)}
                    className='hidden sm:flex items-center justify-center w-1 hover:w-1.5 bg-gray-200 dark:bg-white/10 hover:bg-blue-500 dark:hover:bg-blue-500 active:bg-blue-600 cursor-col-resize transition-all select-none shrink-0 group'
                    title='Drag left/right to resize sidebar • Double-click to reset (200px)'
                >
                    <div className='w-0.5 h-8 bg-gray-400 dark:bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition' />
                </div>

                {/* Main Content Pane — Strict macOS List View */}
                <div className='flex-1 overflow-auto bg-white dark:bg-black select-none text-xs'>
                    <table className='w-full text-left border-collapse'>
                        <thead>
                            <tr className='border-b border-gray-200 dark:border-white/10 bg-gray-50/90 dark:bg-[#0a0a0f] text-[11px] font-semibold text-gray-500 dark:text-gray-400 sticky top-0 backdrop-blur-md z-10'>
                                <th className='py-2 px-3'>Name</th>
                                <th className='py-2 px-3'>Date Modified</th>
                                <th className='py-2 px-3'>Kind</th>
                                <th className='py-2 px-3 text-right'>Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(activeLocation?.children) && activeLocation.children.length > 0 ? (
                                activeLocation.children.map((item, idx) => (
                                    <tr
                                        key={item.id || idx}
                                        onClick={() => openItem(item)}
                                        onDoubleClick={() => openItem(item)}
                                        className={`cursor-pointer transition hover:bg-blue-50/80 dark:hover:bg-blue-900/30 border-b border-gray-100 dark:border-white/5 ${
                                            idx % 2 === 0 ? 'bg-white dark:bg-black' : 'bg-gray-50/40 dark:bg-[#06060a]'
                                        }`}
                                    >
                                        <td className='py-2 px-3 flex items-center gap-2.5'>
                                            <img src={item.icon} alt={item.name} className='size-5 shrink-0 object-contain' />
                                            <span className='font-medium text-gray-800 dark:text-gray-200 truncate max-w-[280px]'>{item.name}</span>
                                        </td>
                                        <td className='py-2 px-3 text-gray-500 dark:text-gray-400 text-[11px] whitespace-nowrap'>{getItemDate(item)}</td>
                                        <td className='py-2 px-3 text-gray-500 dark:text-gray-400 text-[11px] whitespace-nowrap'>{getItemKind(item)}</td>
                                        <td className='py-2 px-3 text-right text-gray-500 dark:text-gray-400 text-[11px] whitespace-nowrap'>{getItemSize(item)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className='py-12 text-center text-gray-400 text-xs italic'>
                                        This folder is empty
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Finder Footer Status Bar */}
            <div className='flex items-center justify-between px-3 py-1 bg-gray-100/90 dark:bg-[#08080c] border-t border-gray-200 dark:border-white/10 text-[11px] text-gray-500 dark:text-gray-400 select-none shrink-0'>
                <span>{Array.isArray(activeLocation?.children) ? activeLocation.children.length : 0} items, 412.8 GB available</span>
                <span className='flex items-center gap-1.5 font-medium'>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                    <span>macOS Finder Resizable • Sidebar: {sidebarWidth}px</span>
                </span>
            </div>

            {/* ↘️ Bottom-Right Corner Screen Size Resizer Handle */}
            {!isMaximized && (
                <div
                    onMouseDown={handleWindowResizeStart}
                    className='absolute bottom-0 right-0 size-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5 select-none opacity-40 hover:opacity-100 transition'
                    title='Drag to resize Finder window'
                >
                    <svg className='size-2.5 text-gray-500 dark:text-gray-300' viewBox='0 0 10 10' fill='currentColor'>
                        <path d='M9 1L1 9h8V1z' />
                    </svg>
                </div>
            )}
        </div>
    )
}

const FinderWindow = WindowWrapper(Finder, 'finder')

export default FinderWindow
