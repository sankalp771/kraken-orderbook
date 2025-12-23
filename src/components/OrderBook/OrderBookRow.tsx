import React from 'react';
import { ProcessedLevel } from '@/types/orderbook';

interface OrderbookRowProps {
    level: ProcessedLevel;
    side: 'bid' | 'ask';
}

// Memoized row component - only re-renders if data changes
const OrderbookRow: React.FC<OrderbookRowProps> = ({ level, side }) => {
    // Format numbers with proper precision
    const formatPrice = (p: number) => p.toFixed(1);
    const formatVolume = (v: number) => v.toFixed(4);
    const formatTotal = (t: number) => t.toFixed(2);

    return (
        <div className="relative grid grid-cols-3 px-2 py-0.5 text-[10px] font-mono leading-4 hover:bg-[#1e2329] select-none text-gray-300">
            {/* Depth Visualization Background */}
            <div
                className={`absolute top-0 bottom-0 pointer-events-none opacity-20 ${side === 'bid' ? 'bg-[#00e676] right-0' : 'bg-[#ff5252] right-0'}`}
                style={{ width: `${level.depthRatio * 100}%` }}
            />

            <div className={`z-10 text-left ${side === 'bid' ? 'text-[#00e676]' : 'text-[#ff5252]'}`}>
                {formatPrice(level.price)}
            </div>
            <div className="z-10 text-right">
                {formatVolume(level.volume)}
            </div>
            <div className="z-10 text-right text-gray-500">
                {formatTotal(level.total)}
            </div>
        </div>
    );
};

// Memoize with custom comparison
export default React.memo(OrderbookRow, (prev, next) => {
    // Only re-render if actual values changed
    return (
        prev.level.price === next.level.price &&
        prev.level.volume === next.level.volume &&
        prev.level.total === next.level.total &&
        prev.level.depthRatio === next.level.depthRatio
    );
});
