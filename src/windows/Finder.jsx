import { WindowControls } from '#components'
import { locations } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import clsx from 'clsx'
import { ArrowLeft, SearchIcon } from 'lucide-react'

const Finder = () => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();

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
                <WindowControls target="finder" />
                <div className='flex items-center gap-2'>
                    {activeLocation?._parent && (
                        <button
                            onClick={() => setActiveLocation(activeLocation._parent)}
                            className='p-1 rounded hover:bg-gray-200/40 text-gray-700 transition flex items-center'
                            title='Back'
                        >
                            <ArrowLeft className='size-3.5' />
                        </button>
                    )}
                    <span className='window-title font-medium truncate max-w-[280px]'>
                        {activeLocation?.name ? `Finder — ${activeLocation.name}` : "Finder"}
                    </span>
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
