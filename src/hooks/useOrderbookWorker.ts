import { useEffect, useRef } from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';
import { WorkerMessage, MainMessage } from '@/types/orderbook';

export function useOrderbookWorker(symbol: string = 'BTC/USD', useSimulated: boolean = true) {
    const workerRef = useRef<Worker | null>(null);
    const handleTick = useOrderbookStore((state) => state.handleTick);
    const setConnectionStatus = useOrderbookStore((state) => state.setConnectionStatus);

    useEffect(() => {
        // Instantiate worker
        workerRef.current = new Worker(new URL('../workers/orderbook.worker.ts', import.meta.url), {
            type: 'module',
        });

        console.log('[Hook] Worker instantiated');

        workerRef.current.onmessage = (event: MessageEvent<MainMessage>) => {
            const { type, payload } = event.data;

            if (type === 'TICK') {
                handleTick(payload);
                setConnectionStatus('connected'); // Infer connection from data flow
            } else if (type === 'STATUS') {
                setConnectionStatus(payload.connection);
            }
        };

        // Initialize connection
        workerRef.current.postMessage({
            type: 'INIT_CONNECTION',
            payload: { symbol, useSimulated }
        } as WorkerMessage);

        return () => {
            console.log('[Hook] Cleaning up worker');
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, [symbol, useSimulated, handleTick, setConnectionStatus]);

    return workerRef.current;
}
