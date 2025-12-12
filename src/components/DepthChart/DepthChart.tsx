import { useRef, useEffect } from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';

export default function DepthChart() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const latestTick = useOrderbookStore((state) => state.latestTick);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !latestTick) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle Resize
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                canvas.width = width;
                canvas.height = height;
                draw(); // Redraw immediately on resize
            }
        });
        resizeObserver.observe(container);

        const draw = () => {
            const { width, height } = canvas;
            const { bids, asks } = latestTick;

            ctx.clearRect(0, 0, width, height);

            // 1. Determine Scale Domains
            // We need the min and max price across the visible range
            // and the max cumulative volume to scale Y.

            if (bids.length === 0 || asks.length === 0) return;

            const maxBidVol = bids[bids.length - 1].total;
            const maxAskVol = asks[asks.length - 1].total;
            const maxVol = Math.max(maxBidVol, maxAskVol);

            // Price Range needs to be symmetric or full?
            // Let's take the lowest bid and highest ask.
            const minPrice = bids[bids.length - 1].price;
            const maxPrice = asks[asks.length - 1].price;
            const priceRange = maxPrice - minPrice;

            if (priceRange === 0) return;

            // Coordinate Helpers
            const getX = (price: number) => {
                return ((price - minPrice) / priceRange) * width;
            };

            const getY = (vol: number) => {
                // Y=0 is bottom, but canvas Y=0 is top.
                // We want height - (vol/maxVol * height)
                // Add minimal padding so chart doesn't touch top
                const padding = 10;
                const availableHeight = height - padding;
                return height - ((vol / maxVol) * availableHeight);
            };

            // 2. Draw Bids (Green area)
            // Bids go from High Price (Tip) down to Low Price.
            // On X axis: Tip (Center-ish) -> Low (Left)
            // We need to sort by price ascending for drawing the polygon left-to-right correctly?
            // Bids array is sorted High->Low. 
            // Let's reverse to draw from Left (Low Price) to Right (Tip).

            ctx.fillStyle = 'rgba(0, 230, 118, 0.2)'; // Green transparent
            ctx.strokeStyle = '#00e676';
            ctx.lineWidth = 2;

            ctx.beginPath();

            // Start at bottom-left corner of the bid section
            // Lowest Bid Price
            const startBidPrice = bids[bids.length - 1].price;
            ctx.moveTo(getX(startBidPrice), height);

            // Iterate Bids (Low -> High)
            for (let i = bids.length - 1; i >= 0; i--) {
                const p = bids[i].price;
                const v = bids[i].total;
                ctx.lineTo(getX(p), getY(v));
            }

            // Drop to bottom at the highest bid price (Tip)
            const tipBidPrice = bids[0].price; // Highest bid
            ctx.lineTo(getX(tipBidPrice), height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 3. Draw Asks (Red area)
            // Asks are Low -> High. Draw from Tip (Leftish) -> Right (High)

            ctx.fillStyle = 'rgba(255, 82, 82, 0.2)'; // Red transparent
            ctx.strokeStyle = '#ff5252';

            ctx.beginPath();

            // Start at bottom at Tip Price
            const tipAskPrice = asks[0].price; // Lowest Ask
            ctx.moveTo(getX(tipAskPrice), height);

            // Iterate Asks (Low -> High)
            for (let i = 0; i < asks.length; i++) {
                const p = asks[i].price;
                const v = asks[i].total;
                ctx.lineTo(getX(p), getY(v));
            }

            // Drop to bottom at highest Ask Price
            const maxAskPrice = asks[asks.length - 1].price;
            ctx.lineTo(getX(maxAskPrice), height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 4. Draw Mid-Price Line (Optional)
            /* 
            const midX = getX((tipAskPrice + tipBidPrice) / 2);
            ctx.strokeStyle = '#ffffff';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(midX, 0);
            ctx.lineTo(midX, height);
            ctx.stroke();
            ctx.setLineDash([]);
            */
        };

        draw();

        return () => resizeObserver.disconnect();
    }, [latestTick]);

    return (
        <div ref={containerRef} className="w-full h-48 bg-[#1e1e1e] border border-[#333] rounded-lg mt-4 overflow-hidden relative">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
