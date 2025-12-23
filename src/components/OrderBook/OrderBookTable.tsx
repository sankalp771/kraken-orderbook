
import React, { useMemo } from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';
import OrderbookRow from './OrderbookRow';
import '@/styles/orderbook.css';

const OrderbookTable: React.FC = () => {
    const snapshot = useOrderbookStore(state => state.latestSnapshot);

    // Limit to what fits on screen (approx 12-15 levels per side)
    const { asks, bids, spread, spreadPercent } = useMemo(() => {
        if (!snapshot) {
            return { asks: [], bids: [], spread: 0, spreadPercent: 0 };
        }

        const MAX_LEVELS = 100; // Allow more levels for scrolling

        return {
            asks: snapshot.asks.slice(0, MAX_LEVELS).reverse(),
            bids: snapshot.bids.slice(0, MAX_LEVELS),
            spread: snapshot.spread,
            spreadPercent: snapshot.spreadPercent
        };
    }, [snapshot]);

    if (!snapshot) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                Connecting...
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-[#0b0e11] text-xs">
            {/* Header */}
            <div className="grid grid-cols-3 px-2 py-1.5 border-b border-[#2a2a2a] text-[#6b7280] font-medium text-[10px] uppercase tracking-wider bg-[#0b0e11] flex-shrink-0 z-10">
                <div className="text-left">Price</div>
                <div className="text-right">Size</div>
                <div className="text-right">Total</div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar relative">
                <div className="flex flex-col">
                    {/* Asks (Red) - Reverse Order (High -> Low) */}
                    <div className="flex flex-col-reverse">
                        {asks.map((level, idx) => (
                            <OrderbookRow
                                key={`ask-${level.price}-${idx}`}
                                level={level}
                                side="ask"
                            />
                        ))}
                    </div>

                    {/* Spread */}
                    <div className="py-1 my-1 border-y border-[#1e2329] bg-[#161a1e] flex justify-center items-center gap-2 font-mono text-gray-400 sticky top-0 z-0 opacity-90 backdrop-blur-sm">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500">Spread</span>
                        <span className="font-bold text-white">{spread.toFixed(1)}</span>
                        <span className="text-[10px] text-gray-500">({spreadPercent.toFixed(2)}%)</span>
                    </div>

                    {/* Bids (Green) - Normal Order (High -> Low) */}
                    <div className="flex flex-col">
                        {bids.map((level, idx) => (
                            <OrderbookRow
                                key={`bid-${level.price}-${idx}`}
                                level={level}
                                side="bid"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(OrderbookTable);
