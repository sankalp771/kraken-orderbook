import { useOrderbookStore } from '@/store/orderbook-store';

export function useWebSocket() {
    const connectionStatus = useOrderbookStore((state) => state.connectionStatus);
    const latency = useOrderbookStore((state) => state.latency);

    return { connectionStatus, latency };
}
