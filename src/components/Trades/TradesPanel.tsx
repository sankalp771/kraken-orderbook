
import React, { useState, useEffect } from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';

interface Trade {
    id: number;
    price: number;
    size: number;
    side: 'buy' | 'sell';
    time: string;
}

const TradesPanel: React.FC = () => {
    const snapshot = useOrderbookStore(state => state.latestSnapshot);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [lastPrice, setLastPrice] = useState(0);

    // Initial dummy data
    useEffect(() => {
        setTrades(Array.from({ length: 30 }).map((_, i) => ({
            id: Date.now() - i * 1000,
            price: 50000 + Math.random() * 100,
            size: Math.random() * 2,
            side: Math.random() > 0.5 ? 'buy' : 'sell',
            time: new Date(Date.now() - i * 1000).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        })));
    }, []);

    useEffect(() => {
        if (!snapshot) return;

        const currentPrice = snapshot.lastPrice;

        if (lastPrice !== 0 && currentPrice !== lastPrice) {
            const side = currentPrice > lastPrice ? 'buy' : 'sell';
            const size = Math.random() * 5;

            const newTrade: Trade = {
                id: Date.now(),
                price: currentPrice,
                size,
                side,
                time: new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            };

            setTrades(prev => [newTrade, ...prev].slice(0, 100));
        }

        setLastPrice(currentPrice);
    }, [snapshot, lastPrice]);

    return (
        <div className="flex flex-col h-full w-full bg-[#0b0e11] font-mono text-xs">
            {/* Column Headers */}
            <div className="flex-none grid grid-cols-3 gap-4 px-3 py-1.5 text-[10px] text-gray-500 uppercase font-bold border-b border-[#1a1a1a] bg-[#0b0e11]">
                <div className="text-left">Price</div>
                <div className="text-right">Size</div>
                <div className="text-right">Time</div>
            </div>

            {/* Trades List */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                {trades.map((trade) => (
                    <div
                        key={trade.id}
                        className="grid grid-cols-3 gap-4 px-3 py-0.5 text-[10px] hover:bg-[#15181c] transition-colors border-b border-[#15181c] leading-tight"
                    >
                        <div className={`text-left font-medium ${trade.side === 'buy' ? 'text-[#00e676]' : 'text-[#ff5252]'
                            }`}>
                            {trade.price.toFixed(1)}
                        </div>
                        <div className="text-right text-gray-300">
                            {trade.size.toFixed(4)}
                        </div>
                        <div className="text-right text-gray-500 text-[9px] opacity-70">
                            {trade.time}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(TradesPanel);
