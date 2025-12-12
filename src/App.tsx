import { useOrderbookWorker } from '@/hooks/useOrderbookWorker';
import { useOrderbookStore } from '@/store/orderbook-store';

function App() {
    // Initialize worker with simulated feed for now to test wiring
    useOrderbookWorker('BTC/USD', true);

    const { connectionStatus, tickCount, latestTick } = useOrderbookStore();

    const bestBid = latestTick?.bids?.[0]?.price || 'N/A';
    const bestAsk = latestTick?.asks?.[0]?.price || 'N/A';
    const spread = latestTick ? latestTick.spread.toFixed(2) : '0.00';

    return (
        <div className="p-8 font-mono text-white w-full max-w-2xl mx-auto border border-gray-700 rounded bg-gray-900">
            <h1 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Debug Console (Phase 3)</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded">
                    <h2 className="text-gray-400 text-sm mb-1">Status</h2>
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="capitalize font-bold text-lg">{connectionStatus}</span>
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                    <h2 className="text-gray-400 text-sm mb-1">Tick Count</h2>
                    <span className="font-bold text-2xl text-blue-400">{tickCount}</span>
                </div>
            </div>

            <div className="bg-black p-4 rounded border border-gray-800">
                <h2 className="text-yellow-500 mb-2 font-bold uppercase tracking-wider">Top of Book</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-red-500 text-sm">Best Ask</div>
                        <div className="text-xl font-bold">{bestAsk}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm">Spread</div>
                        <div className="text-xl text-yellow-500">{spread}</div>
                    </div>
                    <div>
                        <div className="text-green-500 text-sm">Best Bid</div>
                        <div className="text-xl font-bold">{bestBid}</div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-xs text-gray-600">
                <p>Values updated via Web Worker stream @ ~10fps</p>
            </div>
        </div>
    )
}

export default App
