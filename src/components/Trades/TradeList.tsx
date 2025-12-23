import { memo, useState, useEffect, useRef } from 'react';

// Since we don't have a real trade history stream in the Worker 'TICK' message yet 
// (the 'ViewState' type has spread/lastPrice but not a trades array), 
// we will simulate a local history of trades based on "lastPrice" changes for Phase 4 visual compliance.
// In a full implementation, we'd add `trades: Trade[]` to ViewState.

// Temporary Trade Type
type Trade = {
    id: number;
    price: number;
    size: number;
    side: 'buy' | 'sell';
    time: string;
};

// Use store to listen for tick updates
import { useOrderbookStore } from '@/store/orderbook-store';

const TradeList = memo(() => {
    const latestTick = useOrderbookStore(state => state.latestTick);
    const [trades, setTrades] = useState<Trade[]>([]);
    const lastPriceRef = useRef<number>(0);

    useEffect(() => {
        if (!latestTick) return;

        const currentPrice = latestTick.lastPrice;

        // Detect price change to generate a pseudo-trade
        if (currentPrice !== lastPriceRef.current && lastPriceRef.current !== 0) {
            const side = currentPrice > lastPriceRef.current ? 'buy' : 'sell';
            const size = Math.random() * 2; // Simulation

            const newTrade: Trade = {
                id: Date.now(),
                price: currentPrice,
                size: size,
                side: side,
                time: new Date().toLocaleTimeString('en-GB'), // HH:MM:SS
            };

            setTrades(prev => [newTrade, ...prev].slice(0, 50)); // Keep last 50
        }

        lastPriceRef.current = currentPrice;
    }, [latestTick]); // Only depend on latestTick, not lastPriceRef

    return (
        <div className="flex flex-col flex-1 h-full bg-[#121212] text-[11px] font-mono">
            {/* Header */}
            <div className="flex pt-2 pb-2 px-3 text-[#666] font-bold border-b border-[#2a2a2a]">
                <div className="w-1/3 text-left">PRICE</div>
                <div className="w-1/3 text-right">SIZE</div>
                <div className="w-1/3 text-right">TIME</div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {trades.map((t) => (
                    <div key={t.id} className="flex px-3 py-0.5 hover:bg-[#1e1e1e] cursor-default">
                        <div className={`w-1/3 text-left ${t.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                            {t.price.toFixed(2)}
                        </div>
                        <div className="w-1/3 text-right text-gray-400">
                            {t.size.toFixed(4)}
                        </div>
                        <div className="w-1/3 text-right text-gray-500">
                            {t.time}
                        </div>
                    </div>
                ))}
                {trades.length === 0 && (
                    <div className="p-4 text-center text-gray-600 italic">Waiting for trades...</div>
                )}
            </div>
        </div>
    );
});

export default TradeList;
