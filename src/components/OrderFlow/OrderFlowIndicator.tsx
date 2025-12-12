import { useMemo } from 'react';
import { ViewState } from '@/types/orderbook';

interface OrderFlowIndicatorProps {
    tick: ViewState | null;
}

export default function OrderFlowIndicator({ tick }: OrderFlowIndicatorProps) {
    const metrics = useMemo(() => {
        if (!tick) return { buyVol: 0, sellVol: 0, delta: 0, deltaPercent: 0 };

        // Approximation: Bid side volume vs Ask side volume in the current snapshot
        // True order flow requires trade stream, but we use snapshot imbalance here as proxy
        const buyVol = tick.bids.reduce((acc, b) => acc + b.volume, 0);
        const sellVol = tick.asks.reduce((acc, a) => acc + a.volume, 0);
        const total = buyVol + sellVol;

        return {
            buyVol,
            sellVol,
            delta: buyVol - sellVol,
            deltaPercent: total > 0 ? ((buyVol - sellVol) / total) * 100 : 0
        };
    }, [tick]);

    const isBullish = metrics.delta > 0;

    return (
        <div className="flex flex-col gap-1 p-2 bg-[#2a2a2a] rounded text-xs mt-2">
            <div className="flex justify-between text-gray-400">
                <span>Imbalance</span>
                <span className={isBullish ? 'text-green-500' : 'text-red-500'}>
                    {metrics.delta > 0 ? '+' : ''}{metrics.delta.toFixed(2)} ({metrics.deltaPercent.toFixed(1)}%)
                </span>
            </div>
            <div className="flex w-full h-2 bg-gray-700 rounded overflow-hidden">
                <div
                    className="bg-green-500 transition-all duration-300"
                    style={{ width: `${(metrics.buyVol / (metrics.buyVol + metrics.sellVol)) * 100}%` }}
                />
                {/* Remaining space is implicitly the 'sell' side or background */}
            </div>
            <div className="flex justify-between text-[10px] text-gray-500">
                <span>Bid Power</span>
                <span>Ask Power</span>
            </div>
        </div>
    );
}
