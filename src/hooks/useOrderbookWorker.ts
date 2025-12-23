import { useEffect, useRef } from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';
import { WorkerMessage, MainMessage } from '@/types/orderbook';

// STABLE HOOK - only re-runs when symbol changes
export function useOrderbookWorker(symbol: string, useSimulated: boolean = false) {
    const workerRef = useRef<Worker | null>(null);

    // Get store actions (these are stable references)
    const setSnapshot = useOrderbookStore.getState().setSnapshot;
    const setConnectionStatus = useOrderbookStore.getState().setConnectionStatus;

    useEffect(() => {
        console.log(`[useOrderbookWorker] Initializing for ${symbol} (simulated: ${useSimulated})`);

        // Create worker
        workerRef.current = new Worker(
            new URL('../workers/orderbook.worker.ts', import.meta.url),
            { type: 'module' }
        );

        // Handle messages from worker
        workerRef.current.onmessage = (event: MessageEvent<MainMessage>) => {
            const { type, payload } = event.data;

            if (type === 'TICK') {
                // Use store action directly - no state updates in this component
                setSnapshot(payload);
                setConnectionStatus('connected');
            } else if (type === 'STATUS') {
                setConnectionStatus(payload.connection);
            }
        };

        // Initialize connection
        const initMessage: WorkerMessage = {
            type: 'INIT_CONNECTION',
            payload: { symbol, useSimulated }
        };
        workerRef.current.postMessage(initMessage);

        // Cleanup on unmount or symbol change
        return () => {
            console.log(`[useOrderbookWorker] Cleaning up for ${symbol}`);
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, [symbol, useSimulated]); // ONLY these dependencies

    return workerRef.current;
}
