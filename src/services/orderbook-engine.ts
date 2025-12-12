import { OrderbookUpdate, OrderbookSnapshot, ViewState, ProcessedLevel } from '@/types/orderbook';

export interface IOrderbookEngine {
    processSnapshot(snapshot: OrderbookSnapshot): void;
    processUpdate(update: OrderbookUpdate): void;
    getL2View(depth: number): ViewState;
    clear(): void;
}

export class OrderbookEngine implements IOrderbookEngine {
    private bids: Map<number, number> = new Map();
    private asks: Map<number, number> = new Map();
    private lastPrice: number = 0;
    private lastUpdateTimestamp: number = 0;

    constructor() {
        this.processSnapshot = this.processSnapshot.bind(this);
        this.processUpdate = this.processUpdate.bind(this);
        this.getL2View = this.getL2View.bind(this);
    }

    processSnapshot(snapshot: OrderbookSnapshot): void {
        this.bids.clear();
        this.asks.clear();

        for (const [price, volume] of snapshot.bids) {
            this.bids.set(price, volume);
        }

        for (const [price, volume] of snapshot.asks) {
            this.asks.set(price, volume);
        }

        if (snapshot.timestamp) {
            this.lastUpdateTimestamp = snapshot.timestamp;
        } else {
            this.lastUpdateTimestamp = Date.now();
        }
    }

    processUpdate(update: OrderbookUpdate): void {
        const { price, volume, side } = update;
        const targetMap = side === 'bid' ? this.bids : this.asks;

        if (volume === 0) {
            targetMap.delete(price);
        } else {
            targetMap.set(price, volume);
        }

        if (update.timestamp) {
            this.lastUpdateTimestamp = update.timestamp;
        }
    }

    getL2View(depth: number = 50): ViewState {
        const timestamp = Date.now();

        // Sort Bids: High to Low
        const sortedBids = Array.from(this.bids.entries())
            .sort((a, b) => b[0] - a[0])
            .slice(0, depth);

        // Sort Asks: Low to High
        const sortedAsks = Array.from(this.asks.entries())
            .sort((a, b) => a[0] - b[0])
            .slice(0, depth);

        const bestBid = sortedBids.length > 0 ? sortedBids[0][0] : 0;
        const bestAsk = sortedAsks.length > 0 ? sortedAsks[0][0] : 0;

        // Calculate basics
        const spread = (bestAsk > 0 && bestBid > 0) ? bestAsk - bestBid : 0;
        const spreadPercent = (bestAsk > 0) ? (spread / bestAsk) * 100 : 0;

        // Last mid-price or just calculate approximate
        if (bestBid > 0 && bestAsk > 0) {
            this.lastPrice = (bestBid + bestAsk) / 2;
        }

        // Cumulative Volume Calculations
        const finalBids: ProcessedLevel[] = [];
        let bidTotal = 0;
        let maxBidTotal = 0;

        for (const [price, volume] of sortedBids) {
            bidTotal += volume;
            finalBids.push({ price, volume, total: bidTotal, depthRatio: 0 });
        }
        maxBidTotal = bidTotal;

        const finalAsks: ProcessedLevel[] = [];
        let askTotal = 0;
        let maxAskTotal = 0;

        for (const [price, volume] of sortedAsks) {
            askTotal += volume;
            finalAsks.push({ price, volume, total: askTotal, depthRatio: 0 });
        }
        maxAskTotal = askTotal;

        // Normalize Depth Ratios (Relative to the larger of the two total volumes in scope, or each side independent?)
        // Usually depth charts are relative to the max volume in the view.
        const maxVol = Math.max(maxBidTotal, maxAskTotal);

        if (maxVol > 0) {
            finalBids.forEach(b => b.depthRatio = b.total / maxVol);
            finalAsks.forEach(a => a.depthRatio = a.total / maxVol);
        }

        return {
            bids: finalBids,
            asks: finalAsks,
            spread,
            spreadPercent,
            lastPrice: this.lastPrice,
            timestamp: this.lastUpdateTimestamp || timestamp
        };
    }

    clear(): void {
        this.bids.clear();
        this.asks.clear();
    }
}
