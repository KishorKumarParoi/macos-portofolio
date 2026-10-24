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

            {/* Center / Right: Cross-Portfolio Links & macOS Status */}
            <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
                <a
                    href="https://re-invent-rust.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 text-[11px] text-cyan-300 hover:text-cyan-200 transition-all shadow-sm"
                    title="Open Reinvent 3D Portfolio"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>Reinvent 3D ↗</span>
                </a>

                <a
                    href="https://koom-ai.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-purple-500/30 hover:border-purple-400 text-[11px] text-purple-300 hover:text-purple-200 transition-all shadow-sm"
                    title="Open KoomAI Platform"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                    <span>KoomAI ↗</span>
                </a>

                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-[11px] text-white/90 shadow-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>macOS Sequoia</span>
                    <span className="text-white/40">•</span>
                    <span className="text-emerald-300">99.9% Uptime</span>
                </div>
            </div>
        </footer>
    );
};

export default DesktopFooter;
