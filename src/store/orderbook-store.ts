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

    // Time Travel State
    historyBuffer: ViewState[];
    isHistoryMode: boolean;
    historyIndex: number;

    // Actions (these won't cause component re-renders unless they change)
    setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void;
    setSelectedSymbol: (symbol: string) => void;
    setSnapshot: (snapshot: ViewState) => void;
    setLatency: (ms: number) => void;
    incrementTick: () => void;
    setTimeTravelIndex: (index: number) => void;
}

export const useOrderbookStore = create<OrderbookStore>((set) => ({
    // Initial state
    connectionStatus: 'disconnected',
    selectedSymbol: 'BTC/USD',
    latestSnapshot: null,
    tickCount: 0,
    latency: 0,

    // Time Travel State
    historyBuffer: [],
    isHistoryMode: false,
    historyIndex: -1,

    // Actions
    setConnectionStatus: (status) => set({ connectionStatus: status }),

    setSelectedSymbol: (symbol) => set({
        selectedSymbol: symbol,
        // Reset history when symbol changes
        historyBuffer: [],
        isHistoryMode: false,
        historyIndex: -1,
        latestSnapshot: null,
        tickCount: 0
    }),

    setSnapshot: (snapshot) => set((state) => {
        // Add to history buffer (limit to 300 entries)
        const newHistory = [...state.historyBuffer, snapshot];
        if (newHistory.length > 300) {
            newHistory.shift();
        }

        // If in history mode, we assume the historyIndex refers to an index in the PREVIOUS buffer.
        // Since we shifted (maybe), we need to adjust the index?
        // Actually, if we are in history mode, we are "frozen" in time visually.
        // But the buffer is sliding underneath. This makes the index meaningless if it stays static.
        // Option 1: Pause buffer updates when in history mode? No, requirement says "background continues".
        // Option 2: When buffer shifts, decrement historyIndex.

        let newHistoryIndex = state.historyIndex;
        if (state.historyBuffer.length >= 300) {
            // Buffer was full, so we shifted one out.
            if (state.isHistoryMode) {
                newHistoryIndex = Math.max(0, state.historyIndex - 1);
            }
        }

        // Determine what to show
        // If Live: Show new snapshot
        // If History: Keep showing what we are showing (which might be updated by index shift if we wanted to stay on same "frame", but simpler is to just update the reference from the new array).
        // Actually best UX: If I am looking at frame #100, and a new one comes in, the buffer becomes size 301 -> 300. Frame #100 typically becomes frame #99.

        return {
            historyBuffer: newHistory,
            tickCount: state.tickCount + 1,
            // Only update the display if we are NOT in history mode
            latestSnapshot: state.isHistoryMode ? state.latestSnapshot : snapshot,
            historyIndex: newHistoryIndex
        };
    }),

    setLatency: (ms) => set({ latency: ms }),

    incrementTick: () => set((state) => ({ tickCount: state.tickCount + 1 })),

    setTimeTravelIndex: (index) => set((state) => {
        // -1 or index >= length means LIVE
        if (index === -1 || index >= state.historyBuffer.length) {
            const liveSnap = state.historyBuffer[state.historyBuffer.length - 1] || null;
            return {
                isHistoryMode: false,
                historyIndex: -1,
                latestSnapshot: liveSnap
            };
        }

        // History mode
        const histSnap = state.historyBuffer[index];
        return {
            isHistoryMode: true,
            historyIndex: index,
            latestSnapshot: histSnap
        };
    })
}));
