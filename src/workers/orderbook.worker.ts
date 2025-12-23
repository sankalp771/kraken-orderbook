import { WorkerMessage, MainMessage, ViewState, KrakenV2Message, KrakenLevel } from '@/types/orderbook';
import { OrderbookEngine } from '@/services/orderbook-engine';
import { WebSocketService } from '@/services/websocket';
import { SnapshotManager } from '@/services/snapshot-manager';
import { RateLimiter } from '@/utils/throttle';

const ctx = self as any;

const engine = new OrderbookEngine();
const snapshotManager = new SnapshotManager();
const rateLimiter = new RateLimiter(100); // 10 FPS default

// Internal state to track if we received the first snapshot
let isReady = false;

const parseKrakenLevel = (level: KrakenLevel): [number, number] => {
    return [level.price, level.qty];
};

const handleWSMessage = (raw: any) => {
    // Check for Kraken V2 format
    // Format: { channel: "book", type: "snapshot"|"update", data: [...] }
    if (raw.channel === 'heartbeat') return;

    if (raw.channel === 'book') {
        const type = raw.type;
        const data = raw.data?.[0]; // items are usually in data[0]

        if (!data) return;

        if (type === 'snapshot') {
            engine.processSnapshot({
                bids: data.bids.map(parseKrakenLevel),
                asks: data.asks.map(parseKrakenLevel),
                timestamp: Date.now()
            });
            isReady = true;
        } else if (type === 'update') {
            if (!isReady) return; // Ignore updates until snapshot

            // Kraken V2 sends 'bids' and 'asks' arrays in update
            if (data.bids && data.bids.length > 0) {
                data.bids.forEach((b: KrakenLevel) => {
                    engine.processUpdate({
                        price: b.price,
                        volume: b.qty,
                        side: 'bid',
                        timestamp: Date.now()
                    });
                });
            }
            if (data.asks && data.asks.length > 0) {
                data.asks.forEach((a: KrakenLevel) => {
                    engine.processUpdate({
                        price: a.price,
                        volume: a.qty,
                        side: 'ask',
                        timestamp: Date.now()
                    });
                });
            }
        }
    }
};

const wsService = new WebSocketService(handleWSMessage);

const tickLoop = () => {
    if (isReady && rateLimiter.canRun()) {
        const view = engine.getL2View(50); // Get top 50 levels

        // Pass to Snapshot Manager for history
        snapshotManager.add(view);

        const message: MainMessage = {
            type: 'TICK',
            payload: view
        };

        ctx.postMessage(message);
    }

    setTimeout(tickLoop, 16);
};

ctx.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const msg = event.data;

    switch (msg.type) {
        case 'INIT_CONNECTION':
            isReady = false; // Reset ready state
            engine.clear();
            // Kraken V2 WS URL
            const KRAKEN_WS_URL = 'wss://ws.kraken.com/v2';
            wsService.connect({ url: KRAKEN_WS_URL, symbol: msg.payload.symbol }, msg.payload.useSimulated);
            break;

        case 'STOP_CONNECTION':
            wsService.disconnect();
            isReady = false;
            break;

        case 'SET_THROTTLE_MS':
            // @ts-ignore
            rateLimiter.setInterval(msg.payload);
            break;

        case 'REQUEST_SNAPSHOT':
            // Handle time travel request
            if (msg.payload.timestamp) {
                const hist = snapshotManager.getAtTime(msg.payload.timestamp);
                if (hist) {
                    // Determine if we need a separate message type or just TICK
                    // Usually for time travel you pause live updates.
                    // For now, we assume the UI handles 'pause' visual state.
                    ctx.postMessage({ type: 'TICK', payload: hist });
                }
            }
            break;
    }
};

tickLoop();
