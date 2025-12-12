export type OrderbookUpdate = {
    price: number;
    volume: number;
    side: 'bid' | 'ask';
    timestamp?: number;
};

export type OrderbookSnapshot = {
    bids: [number, number][]; // [price, volume]
    asks: [number, number][]; // [price, volume]
    checksum?: number;
    timestamp?: number;
};

export type ViewState = {
    bids: ProcessedLevel[];
    asks: ProcessedLevel[];
    spread: number;
    spreadPercent: number;
    lastPrice: number;
    timestamp: number;
};

export type ProcessedLevel = {
    price: number;
    volume: number;
    total: number; // Cumulative volume
    depthRatio: number; // 0-1 relative to max depth
};

export type WorkerMessage =
    | { type: 'INIT_CONNECTION'; payload: { symbol: string; useSimulated: boolean } }
    | { type: 'STOP_CONNECTION' }
    | { type: 'SET_THROTTLE_MS'; payload: number }
    | { type: 'REQUEST_SNAPSHOT'; payload: { timestamp?: number } }; // For time travel

export type MainMessage =
    | { type: 'TICK'; payload: ViewState }
    | { type: 'STATUS'; payload: { connection: 'connected' | 'disconnected' | 'connecting' | 'error'; latency: number } }
    | { type: 'ERROR'; payload: string };

// Kraken V2 Specifics
export type KrakenLevel = {
    price: number;
    qty: number;
};

export type KrakenV2Message = {
    channel: string;
    type: 'snapshot' | 'update' | 'trade' | 'heartbeat';
    data: any[];
};
