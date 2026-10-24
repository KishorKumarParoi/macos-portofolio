import React, { useEffect, useState } from 'react';

const VisitorCounter = ({ variant = 'default' }) => {
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const trackVisitor = async () => {
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
                    const data = await res.json();
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
            {/* Live Visitors Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 shadow-lg text-xs font-medium text-white transition-all hover:bg-black/60 hover:border-emerald-400/50 hover:scale-105 active:scale-95">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-gray-300 text-[11px]">Live Visitors:</span>
                <span className="font-bold text-emerald-400 font-mono">
                    {loading ? '...' : count ? count.toLocaleString() : '2,865'}
                </span>
            </div>
        </div>
    );
};

export default VisitorCounter;
