import { memo } from 'react';
import { ProcessedLevel } from '@/types/orderbook';
import HeatmapOverlay from './HeatmapOverlay';
import './OrderBookTable.css';

interface OrderBookRowProps {
    level: ProcessedLevel;
    side: 'bid' | 'ask';
}

const OrderBookRow = memo(({ level, side }: OrderBookRowProps) => {
    // Formatting numbers
    const formatPrice = (p: number) => p.toFixed(2); // Crypto specific formatting needed usually, but fixed 2 for now
    const formatVol = (v: number) => v.toFixed(4);

    return (
        <div className={`orderbook-row side-${side}`}>
            <HeatmapOverlay depthRatio={level.depthRatio} side={side} />

            <div className="price-cell text-left pl-2">
                {formatPrice(level.price)}
            </div>
            <div className="vol-cell">
                {formatVol(level.volume)}
            </div>
            <div className="total-cell pr-2">
                {formatVol(level.total)}
            </div>
        </div>
    );
}, (prev, next) => {
    // Custom comparison for performance optimization
    // Only re-render if data values changed. 
    // Usually object identity differs but values might be same.
    return (
        prev.level.price === next.level.price &&
        prev.level.volume === next.level.volume &&
        prev.level.total === next.level.total &&
        prev.level.depthRatio === next.level.depthRatio
    );
});

export default OrderBookRow;
