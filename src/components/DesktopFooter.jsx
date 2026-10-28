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
                    href="https://kishor.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-amber-500/30 hover:border-amber-400 text-[11px] text-amber-300 hover:text-amber-200 transition-all shadow-sm"
                    title="Open Main Portfolio (https://kishor.tech/)"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Main Portfolio ↗</span>
                </a>

                <a
                    href="https://3d.kishor.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 text-[11px] text-cyan-300 hover:text-cyan-200 transition-all shadow-sm"
                    title="Open Reinvent 3D Portfolio (https://3d.kishor.tech/)"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>Reinvent 3D ↗</span>
                </a>

                <a
                    href="https://hacker.kishor.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-400 text-[11px] text-emerald-300 hover:text-emerald-200 transition-all shadow-sm"
                    title="Open 3D Cyber Hacker Cockpit (https://hacker.kishor.tech/)"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Hacker Cockpit ↗</span>
                </a>

                <a
                    href="https://koom.kishor.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-purple-500/30 hover:border-purple-400 text-[11px] text-purple-300 hover:text-purple-200 transition-all shadow-sm"
                    title="Open KoomAI Subdomain (https://koom.kishor.tech)"
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
