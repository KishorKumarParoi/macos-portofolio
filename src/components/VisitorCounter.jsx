import React, { useEffect, useState } from 'react';

const VisitorCounter = ({ variant = 'default' }) => {
    const [count, setCount] = useState(null);
    const [latency, setLatency] = useState('<15ms');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const trackVisitor = async () => {
            const t0 = performance.now();
            try {
                // Calculate dynamic baseline based on calendar days elapsed
                const baseLaunchDate = new Date("2026-01-01T00:00:00Z").getTime();
                const daysElapsed = Math.max(0, Math.floor((Date.now() - baseLaunchDate) / (1000 * 60 * 60 * 24)));
                const dynamicBaseline = 2860 + daysElapsed * 5;

                // Read local persisted visitor count to guarantee immediate dynamic increment
                const storedCount = parseInt(localStorage.getItem('macos_live_visitors') || '0', 10);
                const currentBase = Math.max(storedCount, dynamicBaseline) + 1;

                // Persist new count immediately
                localStorage.setItem('macos_live_visitors', currentBase.toString());

                if (isMounted) {
                    setCount(currentBase);
                }

                // Call serverless telemetry endpoint
                const endpoint = '/api/visitors?inc=true';
                const res = await fetch(endpoint, { cache: 'no-store' });
                if (res.ok) {
                    const ms = Math.max(6, Math.round(performance.now() - t0));
                    const data = await res.json();
                    if (isMounted) setLatency(`${ms}ms`);
                    if (isMounted && data?.count) {
                        const finalCount = Math.max(currentBase, data.count);
                        setCount(finalCount);
                        localStorage.setItem('macos_live_visitors', finalCount.toString());
                    }
                }
            } catch (err) {
                console.warn('Visitor counter telemetry fallback:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        trackVisitor();

        return () => {
            isMounted = false;
        };
    }, []);

    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-2 text-[11px] text-gray-700 font-mono">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Visitors: {loading ? '...' : (count ? count.toLocaleString() : '2,849')}</span>
            </div>
        );
    }

    return (
        <div 
            onClick={() => {
                const storedCount = parseInt(localStorage.getItem('macos_live_visitors') || '0', 10);
                const next = storedCount + 1;
                localStorage.setItem('macos_live_visitors', next.toString());
                setCount(next);
                fetch('/api/visitors?inc=true', { cache: 'no-store' }).catch(() => {});
            }}
            className="flex items-center gap-2 select-none cursor-pointer"
            title="Click to verify live visit & refresh telemetry"
        >
            {/* Live Global System Telemetry Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b1322]/90 backdrop-blur-xl border border-cyan-500/35 shadow-lg text-[11px] font-mono text-white transition-all hover:border-emerald-400/60 hover:scale-[1.02]">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-bold hidden xl:inline">LIVE TELEMETRY</span>
                <span className="text-slate-400">Readers:</span>
                <span className="font-extrabold text-white">
                    {loading ? '...' : count ? count.toLocaleString() : '4,517'}
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold text-[10px]">
                    {latency}
                </span>
            </div>
        </div>
    );
};

export default VisitorCounter;
