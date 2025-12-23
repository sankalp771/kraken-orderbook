
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
            timeLabel = `${(diffMs / 1000).toFixed(1)}s ago`;
        } else {
            timeLabel = '0.0s ago';
        }
    }

    return (
        <div className="flex flex-col w-[300px] select-none mx-4">
            <div className="flex items-center justify-between mb-1.5 h-4">
                <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${isHistoryMode ? 'bg-[#ff9800] text-black' : 'bg-[#00e676] text-black'}`}>
                        {isHistoryMode ? 'HISTORY' : 'LIVE'}
                    </span>
                    {isHistoryMode && (
                        <span className="text-[9px] text-[#ff9800] font-mono leading-none">
                            {timeLabel}
                        </span>
                    )}
                </div>

                {isHistoryMode && (
                    <button
                        onClick={handleJumpToLive}
                        className="text-[9px] bg-white/10 hover:bg-white/20 text-white px-1.5 py-[2px] rounded transition-colors uppercase tracking-wider leading-none"
                    >
                        Jump to Live
                    </button>
                )}
            </div>

            <div className="relative h-4 flex items-center group">
                {/* Track Background */}
                <div className="absolute inset-x-0 h-0.5 bg-white/10 rounded-full overflow-hidden group-hover:bg-white/20 transition-colors">
                    {/* Can indicate buffered amount here if needed, but buffer is implicit */}
                </div>

                {/* Range Input */}
                <input
                    type="range"
                    min={0}
                    max={maxIndex}
                    value={sliderValue}
                    onChange={handleChange}
                    className="w-full h-4 bg-transparent appearance-none cursor-pointer z-10 block focus:outline-none
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 
                               [&::-webkit-slider-thumb]:rounded-full 
                               [&::-webkit-slider-thumb]:bg-white 
                               [&::-webkit-slider-thumb]:border-0
                               [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(0,0,0,0.5)]
                               [&::-webkit-slider-thumb]:transition-transform
                               [&::-webkit-slider-thumb]:hover:scale-125
                               "
                />
            </div>
        </div>
    );
};

export default TimeTravelSlider;
