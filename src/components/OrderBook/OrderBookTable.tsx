import React, { useMemo } from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';
import OrderbookRow from './OrderbookRow';
import '@/styles/orderbook.css';

const OrderbookTable: React.FC = () => {
    const snapshot = useOrderbookStore(state => state.latestSnapshot);

    // Limit to what fits on screen (approx 12-15 levels per side)
    const { asks, bids, spread, spreadPercent } = useMemo(() => {
        if (!snapshot) {
            return { asks: [], bids: [], spread: 0, spreadPercent: 0 };
        }

        const MAX_LEVELS = 15; // Show only what fits without scrolling

        return {
            asks: snapshot.asks.slice(0, MAX_LEVELS).reverse(),
            bids: snapshot.bids.slice(0, MAX_LEVELS),
            spread: snapshot.spread,
            spreadPercent: snapshot.spreadPercent
        };
    }, [snapshot]);

    if (!snapshot) {
        return (
            <div className="orderbook-container">
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    Connecting...
                </div>
            </div>
        );
    }

    return (
        <div className="orderbook-container">
            {/* Header */}
            <div className="orderbook-header">
                <div className="orderbook-header-col">Price</div>
                <div className="orderbook-header-col">Size</div>
                <div className="orderbook-header-col">Total</div>
            </div>

            <div className="orderbook-content">
                {/* Asks (Red) */}
                <div className="orderbook-asks-section">
                    {asks.map((level, idx) => (
                        <OrderbookRow
                            key={`ask-${level.price}-${idx}`}
                            level={level}
                            side="ask"
                        />
                    ))}
                </div>

                {/* Spread */}
                <div className="orderbook-spread">
                    <span className="spread-label">Spread</span>
                    <span className="spread-value">
                        {spread.toFixed(1)}
                        <span className="spread-percent ml-1">({spreadPercent.toFixed(2)}%)</span>
                    </span>
                </div>

                {/* Bids (Green) */}
                <div className="orderbook-bids-section">
                    {bids.map((level, idx) => (
                        <OrderbookRow
                            key={`bid-${level.price}-${idx}`}
                            level={level}
                            side="bid"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(OrderbookTable);
