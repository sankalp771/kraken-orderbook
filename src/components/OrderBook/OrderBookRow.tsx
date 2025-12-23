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
        <div
            className={`orderbook-row ${side}`}
            style={{ '--depth-width': `${level.depthRatio * 100}%` } as React.CSSProperties}
        >
            <div className={`orderbook-cell price-${side}`}>
                {formatPrice(level.price)}
            </div>
            <div className="orderbook-cell size">
                {formatVolume(level.volume)}
            </div>
            <div className="orderbook-cell total">
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
