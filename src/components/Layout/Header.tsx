import React, { useCallback } from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';
import TimeTravelSlider from './TimeTravelSlider';

const SYMBOLS = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD'];

const Header: React.FC = () => {
    const connectionStatus = useOrderbookStore(state => state.connectionStatus);
    const selectedSymbol = useOrderbookStore(state => state.selectedSymbol);
    const setSelectedSymbol = useOrderbookStore(state => state.setSelectedSymbol);

    // Stable callback - won't cause re-renders
    const handleSymbolChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSymbol(e.target.value);
    }, [setSelectedSymbol]);

    return (
        <div className="h-14 bg-[#161616] border-b border-[#2a2a2a] px-4 flex items-center justify-between">
            {/* Left: Branding + Symbol Selector */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                    <span className="font-bold text-sm hidden sm:block">KRAKEN ORDERBOOK</span>
                </div>

                {/* Symbol Selector */}
                <select
                    value={selectedSymbol}
                    onChange={handleSymbolChange}
                    className="bg-[#0a0a0a] text-white text-sm font-bold py-1.5 px-3 pr-8 rounded border border-[#2a2a2a] hover:border-[#444] focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                    {SYMBOLS.map(symbol => (
                        <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                </select>
            </div>

            {/* Center: Time Travel Slider */}
            <div className="flex-1 flex justify-center">
                <TimeTravelSlider />
            </div>

            {/* Right: Connection Status */}
            <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`} />
                <span className="text-gray-400 capitalize">{connectionStatus}</span>
            </div>
        </div>
    );
};

export default React.memo(Header);
