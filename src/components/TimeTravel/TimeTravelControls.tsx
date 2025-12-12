import { useState, useCallback } from 'react';
import TimeTravelSlider from './TimeTravelSlider';

// This would typically integrate with useOrderbookStore or a dedicated useTimeTravel hook
// For now, local state managed here or props passed down.

export default function TimeTravelControls() {
    const [isLive, setIsLive] = useState(true);
    const [historyIndex, setHistoryIndex] = useState(599); // Mock max index

    // TODO: Connect to Worker REQUEST_SNAPSHOT message

    const handleToggle = () => {
        setIsLive(!isLive);
        if (!isLive) {
            // Returning to live
            setHistoryIndex(599);
        }
    };

    const handleSliderChange = (val: number) => {
        setHistoryIndex(val);
        // Dispatch worker request here
    };

    return (
        <div className="p-4 bg-[#1e1e1e] border-t border-[#333] flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Time Travel</h3>
                <button
                    onClick={handleToggle}
                    className={`px-3 py-1 text-xs font-bold rounded ${isLive
                            ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                        }`}
                >
                    {isLive ? 'SWITCH TO REPLAY' : 'RETURN TO LIVE'}
                </button>
            </div>

            <TimeTravelSlider
                min={0}
                max={599} // This should be dynamic based on buffer fill
                value={historyIndex}
                onChange={handleSliderChange}
                active={!isLive}
            />
        </div>
    );
}
