import { WindowControls } from '#components'
import { locations } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import clsx from 'clsx'
import { ArrowLeft, SearchIcon, LayoutGrid, List } from 'lucide-react'
import { useState } from 'react'

const Finder = () => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    const openItem = (item) => {
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
        return 'Oct 24, 2026';
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
        <>
            <div id='window-header'>
                <div className='flex items-center gap-2'>
                    <WindowControls target="finder" />
                    {activeLocation?._parent && (
                        <button
                            onClick={() => setActiveLocation(activeLocation._parent)}
                            className='p-1 rounded hover:bg-gray-200/60 text-gray-700 transition flex items-center ml-2'
                            title='Back'
                        >
                            <ArrowLeft className='size-3.5' />
                        </button>
                    )}
                    <span className='window-title font-medium truncate max-w-[240px] text-gray-800 text-xs ml-1'>
                        {activeLocation?.name ? `Finder — ${activeLocation.name}` : "Finder"}
                    </span>
                </div>

                {/* View Mode Toggle: Grid vs List */}
                <div className='flex items-center gap-1 bg-gray-200/80 p-0.5 rounded-md'>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1 rounded transition ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                        title="Grid View (Icons)"
                    >
                        <LayoutGrid className='size-3.5' />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1 rounded transition ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                        title="List View (Details)"
                    >
                        <List className='size-3.5' />
                    </button>
                </div>

                <SearchIcon className='icon' />
            </div>

            <div className='bg-white flex h-full'>
                <div className='sidebar'>
                    {
                        renderList("Favorites", Object.values(locations))
                    }
                    {
                        renderList("Work", locations.work.children)
                    }
                </div>

                {viewMode === 'grid' ? (
                    <ul className='content relative overflow-auto'>
                        {
                            Array.isArray(activeLocation?.children) && activeLocation.children.map((item) => (
                                <li key={item.id} className={item.position}
                                    onClick={() => openItem(item)}>
                                    <img src={item.icon} alt={item.name} />
                                    <p className='text-xs font-medium text-gray-800 text-center max-w-[110px] break-words'>{item.name}</p>
                                </li>
                            ))
                        }
                    </ul>
                ) : (
                    /* macOS List View Table */
                    <div className='flex-1 overflow-auto bg-white select-none text-xs'>
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold text-gray-500 sticky top-0'>
                                    <th className='py-1.5 px-3'>Name</th>
                                    <th className='py-1.5 px-3'>Date Modified</th>
                                    <th className='py-1.5 px-3'>Kind</th>
                                    <th className='py-1.5 px-3 text-right'>Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(activeLocation?.children) && activeLocation.children.map((item, idx) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => openItem(item)}
                                        className={`cursor-pointer transition hover:bg-blue-50/70 border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                    >
                                        <td className='py-1.5 px-3 flex items-center gap-2'>
                                            <img src={item.icon} alt={item.name} className='size-4 shrink-0' />
                                            <span className='font-medium text-gray-800 truncate max-w-[280px]'>{item.name}</span>
                                        </td>
                                        <td className='py-1.5 px-3 text-gray-500 text-[11px]'>{getItemDate(item)}</td>
                                        <td className='py-1.5 px-3 text-gray-500 text-[11px]'>{getItemKind(item)}</td>
                                        <td className='py-1.5 px-3 text-right text-gray-500 text-[11px]'>{getItemSize(item)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Finder Footer Status Bar */}
            <div className='flex items-center justify-between px-3 py-1 bg-gray-100/90 border-t border-gray-200 text-[11px] text-gray-500 select-none'>
                <span>{Array.isArray(activeLocation?.children) ? activeLocation.children.length : 0} items, 412.8 GB available</span>
                <span className='flex items-center gap-1.5 font-medium'>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                    <span>Updated: October 2026 (v2.5)</span>
                </span>
            </div>
        </>
    )
}

const FinderWindow = WindowWrapper(Finder, 'finder')

export default FinderWindow;
