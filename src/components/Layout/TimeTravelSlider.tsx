
import React from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';

const TimeTravelSlider: React.FC = () => {
    const historyBuffer = useOrderbookStore(state => state.historyBuffer);
    const historyIndex = useOrderbookStore(state => state.historyIndex);
    const isHistoryMode = useOrderbookStore(state => state.isHistoryMode);
    const setTimeTravelIndex = useOrderbookStore(state => state.setTimeTravelIndex);

    // Max index
    const maxIndex = Math.max(0, historyBuffer.length - 1);

    // Current value for slider
    const sliderValue = isHistoryMode ? historyIndex : maxIndex;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (val >= maxIndex) {
            setTimeTravelIndex(-1); // Go Live
        } else {
            setTimeTravelIndex(val);
        }
    };

    const handleJumpToLive = () => {
        setTimeTravelIndex(-1);
    };

    // Calculate time difference
    let timeLabel = '';
    if (isHistoryMode && historyBuffer.length > 0 && historyIndex >= 0 && historyIndex < historyBuffer.length) {
        const latestTime = historyBuffer[historyBuffer.length - 1].timestamp;
        const currentTime = historyBuffer[historyIndex].timestamp;
        const diffMs = latestTime - currentTime;

        if (diffMs > 0) {
            timeLabel = `-${(diffMs / 1000).toFixed(1)}s`;
        } else {
            timeLabel = '0.0s';
        }
    }

    return (
        <div className="flex items-center w-full px-4 py-2 select-none h-10 gap-4">
            {/* Label */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[#6b7280] text-[10px] font-bold tracking-[0.2em] uppercase">Time Travel</span>
            </div>

            {/* Slider Track */}
            <div className="flex-1 relative h-4 flex items-center group">
                {/* Track Background */}
                <div className="absolute inset-x-0 h-0.5 bg-white/10 rounded-full overflow-hidden group-hover:bg-white/20 transition-colors"></div>

                {/* Range Input */}
                <input
                    type="range"
                    min={0}
                    max={maxIndex}
                    value={sliderValue}
                    onChange={handleChange}
                    className={`w-full h-4 bg-transparent appearance-none cursor-pointer z-10 block focus:outline-none
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 
                               [&::-webkit-slider-thumb]:rounded-full 
                               [&::-webkit-slider-thumb]:border-2 
                               [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(0,0,0,0.5)]
                               [&::-webkit-slider-thumb]:transition-transform
                               [&::-webkit-slider-thumb]:hover:scale-125
                               ${isHistoryMode
                            ? '[&::-webkit-slider-thumb]:bg-[#ff9800] [&::-webkit-slider-thumb]:border-[#ff9800]/50'
                            : '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[#161616]'
                        }`}
                />

                {/* Ticks/Labels */}
                <div className="absolute top-5 left-0 right-0 flex justify-between px-1 pointer-events-none opacity-40">
                    <span className="text-[8px] font-mono text-gray-500">HISTORY</span>
                    <span className="text-[8px] font-mono text-gray-500">-1m</span>
                    <span className="text-[8px] font-mono text-gray-500">-30s</span>
                    <span className="text-[8px] font-mono text-gray-500">-10s</span>
                    <span className="text-[8px] font-bold text-[#00e676]">LIVE</span>
                </div>
            </div>

            {/* Controls / Status */}
            <div className="flex items-center gap-3 flex-shrink-0 min-w-[140px] justify-end">
                {isHistoryMode ? (
                    <>
                        <span className="text-[#ff9800] text-[10px] font-mono">{timeLabel}</span>
                        <button
                            onClick={handleJumpToLive}
                            className="bg-white/10 hover:bg-white/20 text-white text-[9px] font-bold px-2 py-1 rounded transition-colors uppercase tracking-wider"
                        >
                            Jump to Live
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#00e676]/10 border border-[#00e676]/20 rounded text-[#00e676]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Live View</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimeTravelSlider;
