import React from 'react';
import VisitorCounter from './VisitorCounter';

const DesktopFooter = () => {
    return (
        <footer 
            id="desktop-footer"
            className="fixed bottom-0 left-0 right-0 z-40 px-4 py-1.5 pointer-events-none flex flex-col sm:flex-row items-center justify-between gap-2 text-xs select-none"
        >
            {/* Left: Live Visitor Telemetry */}
            <div className="pointer-events-auto flex items-center gap-2">
                <VisitorCounter />
            </div>

            {/* Right: Clean macOS Status */}
            <div className="pointer-events-auto hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-[11px] text-white/90 shadow-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>macOS Sequoia</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-300">99.9% Uptime</span>
            </div>
        </footer>
    );
};

export default DesktopFooter;
