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
        console.log(`[WS] Connecting to ${config.url} for symbol ${config.symbol}`);
        this.ws = new WebSocket(config.url);

        this.ws.onopen = () => {
            console.log('[WS] Connected successfully!');
            this.subscribe(config.symbol);
            this.startHeartbeat();
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('[WS] <<< Received:', data);
                this.onMessageCallback(data);
            } catch (e) {
                console.error('[WS] Parse error', e, 'Raw:', event.data);
            }
        };

        this.ws.onclose = (event) => {
            console.log(`[WS] Closed! Code: ${event.code}, Reason: "${event.reason || 'none'}", Clean: ${event.wasClean}`);
            this.stopHeartbeat();
            if (this.shouldReconnect) {
                console.log('[WS] Will reconnect in 2s...');
                this.reconnectTimeout = setTimeout(() => this.startRealConnection(config), 2000);
            }
        };

        this.ws.onerror = (err) => {
            console.error('[WS] ❌ Error occurred:', err);
        };
    }

    private subscribe(symbol: string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.warn('[WS] Cannot subscribe, socket not open');
            return;
        }

        const msg = {
            method: "subscribe",
            params: {
                channel: "book",
                symbol: [symbol],
                depth: 10,
                snapshot: true
            }
        };

        console.log('[WS] >>> Sending subscription:', JSON.stringify(msg, null, 2));
        this.ws.send(JSON.stringify(msg));
    }

    private startHeartbeat() {
        // V2 sends heartbeats automatically
    }

    private stopHeartbeat() {
        if (this.pingInterval) clearInterval(this.pingInterval);
    }

    private startSimulation() {
        console.log('[WS] Starting simulation mode');
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
            const isBid = Math.random() > 0.5;
            const basePrice = 50000;
            const spread = 0.5;

            const price = isBid
                ? basePrice - Math.floor(Math.random() * 50) * 5
                : basePrice + spread + Math.floor(Math.random() * 50) * 5;

            const volume = Math.random() > 0.2 ? Math.random() * 2 : 0;

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
        }, 200);
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
