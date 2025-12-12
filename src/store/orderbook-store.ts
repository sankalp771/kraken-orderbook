import { create } from 'zustand';
import { ViewState } from '@/types/orderbook';

interface OrderbookStore {
    connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
    latency: number;
    latestTick: ViewState | null;
    tickCount: number;

    setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void;
    setLatency: (ms: number) => void;
    handleTick: (view: ViewState) => void;
}

export const useOrderbookStore = create<OrderbookStore>((set) => ({
    connectionStatus: 'disconnected',
    latency: 0,
    latestTick: null,
    tickCount: 0,

    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setLatency: (ms) => set({ latency: ms }),
    handleTick: (view) => set((state) => ({
        latestTick: view,
        tickCount: state.tickCount + 1
    })),
}));
