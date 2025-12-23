
import React, { useMemo, useState } from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';
import OrderbookRow from './OrderbookRow';
import '@/styles/orderbook.css';


type ViewMode = 'combined' | 'bids' | 'asks';


const OrderbookTable: React.FC = () => {
    const snapshot = useOrderbookStore(state => state.latestSnapshot);
    const [viewMode, setViewMode] = useState<ViewMode>('combined');

    const { asks, bids, spread, spreadPercent } = useMemo(() => {
        if (!snapshot) {
            return { asks: [], bids: [], spread: 0, spreadPercent: 0 };
        }

        const MAX_LEVELS = 100;

        return {
            // Combined: Asks are reversed (High -> Low) to put Best Ask (Low) at bottom
            // Single view: Asks are normal (Low -> High) to put Best Ask (Low) at top
            asks: viewMode === 'combined'
                ? snapshot.asks.slice(0, MAX_LEVELS).reverse()
                : snapshot.asks.slice(0, MAX_LEVELS * 2), // Show more in single mode?
            bids: snapshot.bids.slice(0, MAX_LEVELS + (viewMode === 'bids' ? MAX_LEVELS : 0)),
            spread: snapshot.spread,
            spreadPercent: snapshot.spreadPercent
        };
    }, [snapshot, viewMode]);

    if (!snapshot) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                Connecting...
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-[#0b0e11] text-xs">
            {/* View Toggle */}
            <div className="flex items-center justify-center p-1.5 border-b border-[#1e2329] bg-[#0b0e11]">
                <div className="flex bg-[#161a1e] p-0.5 rounded border border-[#2a2a2a]">
                    {(['combined', 'bids', 'asks'] as ViewMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded transition-colors ${viewMode === mode
                                ? 'bg-[#333] text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col border-b border-[#2a2a2a] bg-[#0b0e11] flex-shrink-0 z-10">
                {/* Legend */}
                <div className="flex items-center justify-between px-2 py-1 border-b border-[#1e2329] bg-[#111] text-[9px] text-gray-500">
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#00e676]"></span>Bids</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ff5252]"></span>Asks</span>
                    </div>
                    <span className="opacity-50">Total = Cumulative</span>
                </div>
                {/* Columns */}
                <div className="grid grid-cols-3 px-2 py-1.5 text-[#6b7280] font-medium text-[10px] uppercase tracking-wider">
                    <div className="text-left">Price</div>
                    <div className="text-right">Size</div>
                    <div className="text-right">Total</div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar relative">
                <div className="flex flex-col">

                    {/* ASKS SECTION */}
                    {(viewMode === 'combined' || viewMode === 'asks') && (
                        <div className={`flex ${viewMode === 'combined' ? 'flex-col-reverse' : 'flex-col'}`}>
                            {asks.map((level, idx) => (
                                <OrderbookRow
                                    key={`ask-${level.price}-${idx}`}
                                    level={level}
                                    side="ask"
                                />
                            ))}
                        </div>
                    )}

                    {/* SPREAD (Only in Combined Mode) */}
                    {viewMode === 'combined' && (
                        <div className="py-1 my-1 border-y border-[#1e2329] bg-[#161a1e] flex justify-center items-center gap-2 font-mono text-gray-400 sticky top-0 z-0 opacity-90 backdrop-blur-sm">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500">Spread</span>
                            <span className="font-bold text-white">{spread.toFixed(1)}</span>
                            <span className="text-[10px] text-gray-500">({spreadPercent.toFixed(2)}%)</span>
                        </div>
                    )}

                    {/* BIDS SECTION */}
                    {(viewMode === 'combined' || viewMode === 'bids') && (
                        <div className="flex flex-col">
                            {bids.map((level, idx) => (
                                <OrderbookRow
                                    key={`bid-${level.price}-${idx}`}
                                    level={level}
                                    side="bid"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(OrderbookTable);
