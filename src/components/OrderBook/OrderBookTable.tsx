import { useRef, useEffect } from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';
import OrderBookRow from './OrderBookRow';
import './OrderBookTable.css';

// Simple virtualized list constants
const ROW_HEIGHT = 24; // px
const VISIBLE_ROWS = 15; // fallback

export default function OrderBookTable() {
    const latestTick = useOrderbookStore(state => state.latestTick);

    if (!latestTick) {
        return <div className="p-4 text-center text-gray-500">Waiting for data...</div>;
    }

    const { bids, asks, spread, spreadPercent, lastPrice } = latestTick;

    // We take top N asks (lowest price) but display them Reverse order (High -> Low) visually for standard OB feeling
    // Asks: [100, 101, 102] -> Render [102, 101, 100] (so 100 is close to spread)
    const asksToRender = [...asks].reverse();

    // Bids: [99, 98, 97] -> Render [99, 98, 97] (so 99 is close to spread)
    const bidsToRender = bids;

    return (
        <div className="w-full max-w-md bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="grid grid-cols-3 text-xs text-gray-500 p-2 border-b border-[#333] uppercase">
                <div className="text-left pl-2">Price (USD)</div>
                <div className="text-right">Size</div>
                <div className="text-right pr-2">Total</div>
            </div>

            {/* Asks (Red) - Scrollable container if we want full depth, but for now fixed list */}
            <div className="flex-1 overflow-hidden flex flex-col justify-end">
                {asksToRender.map((level) => (
                    <OrderBookRow key={level.price} level={level} side="ask" />
                ))}
            </div>

            {/* Spread Widget */}
            <div className="spread-container flex justify-between px-4">
                <span className="text-gray-400">{spread.toFixed(2)} ({spreadPercent.toFixed(2)}%)</span>
                <div className="flex items-center gap-1">
                    <span className="text-white font-bold">{lastPrice.toFixed(2)}</span>
                    {/* Direction arrow placeholder */}
                </div>
            </div>

            {/* Bids (Green) */}
            <div className="flex-1 overflow-hidden">
                {bidsToRender.map((level) => (
                    <OrderBookRow key={level.price} level={level} side="bid" />
                ))}
            </div>
        </div>
    );
}
