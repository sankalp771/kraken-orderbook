import { memo } from 'react';
import './OrderBookTable.css';

interface HeatmapOverlayProps {
    depthRatio: number; // 0 to 1
    side: 'bid' | 'ask';
}

const HeatmapOverlay = memo(({ depthRatio, side }: HeatmapOverlayProps) => {
    const widthPercent = Math.min(Math.max(depthRatio * 100, 0), 100);

    return (
        <div
            className="heatmap-bar"
            style={{ width: `${widthPercent}%` }}
        />
    );
});

export default HeatmapOverlay;
