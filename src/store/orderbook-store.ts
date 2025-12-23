import { create } from 'zustand';
import { ViewState } from '@/types/orderbook';

interface OrderbookStore {
    // Connection state
    connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';

    // Symbol
    selectedSymbol: string;

    // Orderbook data (immutable - replaced, not mutated)
    latestSnapshot: ViewState | null;

    // Metrics
    tickCount: number;
    latency: number;

    // Actions (these won't cause component re-renders unless they change)
    setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void;
    setSelectedSymbol: (symbol: string) => void;
    setSnapshot: (snapshot: ViewState) => void;
    setLatency: (ms: number) => void;
    incrementTick: () => void;
}

export const useOrderbookStore = create<OrderbookStore>((set) => ({
    // Initial state
    connectionStatus: 'disconnected',
    selectedSymbol: 'BTC/USD',
    latestSnapshot: null,
    tickCount: 0,
    latency: 0,

    // Actions
    setConnectionStatus: (status) => set({ connectionStatus: status }),

    setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

    setSnapshot: (snapshot) => set((state) => ({
        latestSnapshot: snapshot,
        tickCount: state.tickCount + 1
    })),

    setLatency: (ms) => set({ latency: ms }),

    incrementTick: () => set((state) => ({ tickCount: state.tickCount + 1 })),
}));
