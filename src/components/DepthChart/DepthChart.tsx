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

            if (bids.length === 0 || asks.length === 0) return;

            // Limit depth to reasonable range (e.g., top 50 levels each side)
            const DEPTH_LIMIT = Math.min(50, Math.min(bids.length, asks.length));

            // Calculate cumulative volumes if not already present
            const processedBids = bids.slice(0, DEPTH_LIMIT).map((bid, i) => ({
                price: bid.price,
                volume: bid.volume,
                total: bid.total ?? bids.slice(0, i + 1).reduce((sum, b) => sum + b.volume, 0)
            }));

            const processedAsks = asks.slice(0, DEPTH_LIMIT).map((ask, i) => ({
                price: ask.price,
                volume: ask.volume,
                total: ask.total ?? asks.slice(0, i + 1).reduce((sum, a) => sum + a.volume, 0)
            }));

            const maxBidVol = processedBids[processedBids.length - 1].total;
            const maxAskVol = processedAsks[processedAsks.length - 1].total;
            const maxVol = Math.max(maxBidVol, maxAskVol);

            const minPrice = processedBids[processedBids.length - 1].price;
            const maxPrice = processedAsks[processedAsks.length - 1].price;
            const priceRange = maxPrice - minPrice;

            if (priceRange === 0 || maxVol === 0) return;

            // Coordinate Helpers
            const getX = (price: number) => {
                return ((price - minPrice) / priceRange) * width;
            };

            const getY = (vol: number) => {
                // Use square root scaling for better visual distribution
                // This prevents the chart from being too compressed at the bottom
                const paddingTop = 20;
                const paddingBottom = 10;
                const availableHeight = height - paddingTop - paddingBottom;

                // Square root scaling makes small volumes more visible
                const normalizedVol = Math.sqrt(vol / maxVol);
                return height - paddingBottom - (normalizedVol * availableHeight);
            };

            // Draw Bids (Green area) with STEP style
            ctx.fillStyle = 'rgba(0, 230, 118, 0.2)';
            ctx.strokeStyle = '#00e676';
            ctx.lineWidth = 2;

            ctx.beginPath();

            // Start at bottom-left
            const startBidPrice = processedBids[processedBids.length - 1].price;
            ctx.moveTo(getX(startBidPrice), height);

            // Draw steps from Low Price -> High Price (right to left in bid data)
            for (let i = processedBids.length - 1; i >= 0; i--) {
                const curr = processedBids[i];
                const currX = getX(curr.price);
                const currY = getY(curr.total);

                // Horizontal line to current price at current volume
                ctx.lineTo(currX, currY);

                // If not the last point, draw vertical line to next volume level
                if (i > 0) {
                    const nextY = getY(processedBids[i - 1].total);
                    ctx.lineTo(currX, nextY);
                }
            }

            // Close path at bottom-right of bid area
            const tipBidPrice = processedBids[0].price;
            ctx.lineTo(getX(tipBidPrice), height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw Asks (Red area) with STEP style
            ctx.fillStyle = 'rgba(255, 82, 82, 0.2)';
            ctx.strokeStyle = '#ff5252';
            ctx.lineWidth = 2;

            ctx.beginPath();

            // Start at bottom at lowest ask price
            const tipAskPrice = processedAsks[0].price;
            ctx.moveTo(getX(tipAskPrice), height);

            // Draw steps from Low Price -> High Price (left to right in ask data)
            for (let i = 0; i < processedAsks.length; i++) {
                const curr = processedAsks[i];
                const currX = getX(curr.price);
                const currY = getY(curr.total);

                // Vertical line up to current volume
                if (i === 0) {
                    ctx.lineTo(currX, currY);
                } else {
                    const prevY = getY(processedAsks[i - 1].total);
                    ctx.lineTo(currX, prevY);
                    ctx.lineTo(currX, currY);
                }
            }

            // Horizontal line to the right edge
            const maxAskPrice = processedAsks[processedAsks.length - 1].price;
            const lastY = getY(processedAsks[processedAsks.length - 1].total);
            ctx.lineTo(getX(maxAskPrice), lastY);

            // Close path at bottom-right
            ctx.lineTo(getX(maxAskPrice), height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw Mid-Price Line (Optional but recommended)
            const midPrice = (tipAskPrice + tipBidPrice) / 2;
            const midX = getX(midPrice);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(midX, 0);
            ctx.lineTo(midX, height);
            ctx.stroke();
            ctx.setLineDash([]);
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