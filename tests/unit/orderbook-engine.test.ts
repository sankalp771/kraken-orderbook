
import { describe, it, expect, beforeEach } from 'vitest';
import { OrderbookEngine } from '@/services/orderbook-engine';

describe('OrderbookEngine', () => {
    let engine: OrderbookEngine;

    beforeEach(() => {
        engine = new OrderbookEngine();
    });

    it('should process snapshot correctly', () => {
        engine.processSnapshot({
            bids: [[100, 10], [99, 5]],
            asks: [[101, 10], [102, 5]],
            timestamp: 1000
        });

        const view = engine.getL2View(10);
        expect(view.bids.length).toBe(2);
        expect(view.asks.length).toBe(2);
        expect(view.bids[0].price).toBe(100);
        expect(view.asks[0].price).toBe(101);
    });

    it('should process updates (insert/update)', () => {
        engine.processSnapshot({
            bids: [[100, 10]],
            asks: [[101, 10]],
            timestamp: 1000
        });

        // Update existing bid
        engine.processUpdate({
            side: 'bid',
            price: 100,
            volume: 20
        });

        // Insert new ask
        engine.processUpdate({
            side: 'ask',
            price: 102,
            volume: 5
        });

        const view = engine.getL2View(10);
        expect(view.bids[0].volume).toBe(20);
        expect(view.asks.length).toBe(2);
        expect(view.asks[1].price).toBe(102);
    });

    it('should process deletes (volume 0)', () => {
        engine.processSnapshot({
            bids: [[100, 10], [99, 5]],
            asks: [],
            timestamp: 1000
        });

        engine.processUpdate({
            side: 'bid',
            price: 100,
            volume: 0
        });

        const view = engine.getL2View(10);
        expect(view.bids.length).toBe(1);
        expect(view.bids[0].price).toBe(99);
    });

    it('should calculate cumulative totals and spreads', () => {
        engine.processSnapshot({
            bids: [[100, 10], [99, 5]],
            asks: [[101, 10], [102, 5]],
            timestamp: 1000
        });

        const view = engine.getL2View(10);

        // Spread
        expect(view.spread).toBe(1);

        // Bids Total (sorted high to low)
        // 100 -> vol 10, total 10
        // 99 -> vol 5, total 15
        expect(view.bids[0].total).toBe(10);
        expect(view.bids[1].total).toBe(15);
    });
});
