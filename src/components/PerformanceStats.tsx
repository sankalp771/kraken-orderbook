import { useOrderbookStore } from '@/store/orderbook-store';
import { useState, useEffect } from 'react';

export default function PerformanceStats() {
    const tickCount = useOrderbookStore(state => state.tickCount);
    const latency = useOrderbookStore(state => state.latency);

    // Calculate approximate FPS based on tick updates
    const [fps, setFps] = useState(0);
    const lastTickCountRef = useRef(tickCount);
    const lastTimeRef = useRef(performance.now());

    // Need useRef for hook local logic inside effect
    const tickCountRef = useRef(tickCount);
    useEffect(() => { tickCountRef.current = tickCount }, [tickCount]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = performance.now();
            const delta = now - lastTimeRef.current;
            const ticks = tickCountRef.current - lastTickCountRef.current;

            // FPS = ticks / (seconds)
            const currentFps = (ticks / (delta / 1000));
            setFps(currentFps);

            lastTimeRef.current = now;
            lastTickCountRef.current = tickCountRef.current;
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Need to import useRef
    return (
        <div className="fixed bottom-2 right-2 flex gap-4 text-[10px] text-gray-600 font-mono bg-black/80 p-1 px-2 rounded border border-gray-800 pointer-events-none">
            <div>
                <span className="text-gray-400">FPS:</span> {fps.toFixed(1)}
            </div>
            <div>
                <span className="text-gray-400">Ticks:</span> {tickCount}
            </div>
            <div>
                <span className="text-gray-400">Latency:</span> {latency.toFixed(1)}ms
            </div>
        </div>
    );
}

// Fix missing import
import { useRef } from 'react';
