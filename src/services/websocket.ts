import { WSConfig } from '@/services/websocket'; // Note: circular if I import type from class file, better to keep types separate but it's ok for now.
// Better to define WSConfig in types or keep it locally if not shared much.

export type WSCallback = (data: any) => void;

export class WebSocketService {
    private ws: WebSocket | null = null;
    private onMessageCallback: WSCallback;
    private isSimulated: boolean = false;
    private simulationInterval: any = null;
    private pingInterval: any = null;
    private reconnectTimeout: any = null;
    private activeConfig: { url: string; symbol: string } | null = null;
    private shouldReconnect: boolean = true;

    constructor(onMessage: WSCallback) {
        this.onMessageCallback = onMessage;
    }

    connect(config: { url: string; symbol: string }, useSimulated: boolean = false) {
        this.shouldReconnect = true;
        this.activeConfig = config;
        this.isSimulated = useSimulated;

        if (this.ws) {
            this.cleanup();
        }

        if (this.isSimulated) {
            this.startSimulation();
        } else {
            this.startRealConnection(config);
        }
    }

    private startRealConnection(config: { url: string, symbol: string }) {
        console.log(`[WS] Connecting to ${config.url}`);
        this.ws = new WebSocket(config.url);

        this.ws.onopen = () => {
            console.log('[WS] Connected');
            this.subscribe(config.symbol);
            this.startHeartbeat();
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.onMessageCallback(data);
            } catch (e) {
                console.error('[WS] Parse error', e);
            }
        };

        this.ws.onclose = () => {
            console.log('[WS] Closed');
            this.stopHeartbeat();
            if (this.shouldReconnect) {
                console.log('[WS] Reconnecting in 2s...');
                this.reconnectTimeout = setTimeout(() => this.startRealConnection(config), 2000); // Simple linear backoff for now
            }
        };

        this.ws.onerror = (err) => {
            console.error('[WS] Error', err);
        };
    }

    private subscribe(symbol: string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const msg = {
            method: "subscribe",
            params: {
                channel: "book",
                symbol: [symbol],
                depth: 100, // Kraken V2 allows depth selection
                snapshot: true
            }
        };
        this.ws.send(JSON.stringify(msg));
    }

    private startHeartbeat() {
        // V2 sends heartbeats automatically, but we can also ping.
        // We'll just listen for now. Implement ping if needed for keep-alive.
    }

    private stopHeartbeat() {
        if (this.pingInterval) clearInterval(this.pingInterval);
    }

    private startSimulation() {
        console.log('[WS] Starting simulation');
        // Generate initial snapshot
        const initialBids = [];
        const initialAsks = [];
        for (let i = 0; i < 50; i++) {
            initialBids.push({ price: 50000 - i * 5, qty: 1 + Math.random() });
            initialAsks.push({ price: 50000.5 + i * 5, qty: 1 + Math.random() });
        }

        const snapshotMsg = {
            channel: 'book',
            type: 'snapshot',
            data: [{
                symbol: 'BTC/USD',
                bids: initialBids,
                asks: initialAsks,
                checksum: 0
            }]
        };
        this.onMessageCallback(snapshotMsg);

        this.simulationInterval = setInterval(() => {
            // Random updates
            const isBid = Math.random() > 0.5;
            const basePrice = 50000;
            const spread = 0.5;

            const price = isBid
                ? basePrice - Math.floor(Math.random() * 50) * 5
                : basePrice + spread + Math.floor(Math.random() * 50) * 5;

            const volume = Math.random() > 0.2 ? Math.random() * 2 : 0; // 20% chance of delete (vol 0)

            const updateMsg = {
                channel: 'book',
                type: 'update',
                data: [{
                    symbol: 'BTC/USD',
                    bids: isBid ? [{ price, qty: volume }] : [],
                    asks: !isBid ? [{ price, qty: volume }] : [],
                    checksum: 0
                }]
            };

            this.onMessageCallback(updateMsg);
        }, 50); // High frequency updates
    }

    cleanup() {
        this.shouldReconnect = false;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        this.stopHeartbeat();
    }

    disconnect() {
        this.cleanup();
    }
}
