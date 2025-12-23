import React, { useCallback, useState } from 'react';
import { useOrderbookStore } from '@/store/orderbook-store';

const SYMBOLS = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD'];

const Header: React.FC = () => {
    const connectionStatus = useOrderbookStore(state => state.connectionStatus);
    const selectedSymbol = useOrderbookStore(state => state.selectedSymbol);
    const setSelectedSymbol = useOrderbookStore(state => state.setSelectedSymbol);
    const [isOpen, setIsOpen] = useState(false);

    // Stable callback - won't cause re-renders
    const handleSymbolChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSymbol(e.target.value);
    }, [setSelectedSymbol]);

    return (
        <div className="h-14 bg-[#161616] border-b border-[#2a2a2a] px-4 flex items-center justify-between shadow-sm z-50 relative">
            {/* Left: Branding + Symbol Selector */}
            <div className="flex items-center gap-2"> {/* Tighter gap */}
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6f5cff] to-[#4c3fdb] shadow-[0_0_10px_rgba(111,92,255,0.3)]" />
                    <span className="font-bold text-sm tracking-tight text-white hidden sm:block">KRAKEN ORDERBOOK</span>
                </div>

                {/* Vertical Divider */}
                <div className="h-4 w-[1px] bg-[#333] mx-2"></div>

                {/* Custom Pill Selector */}
                <div className="relative group z-50">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                        className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#555] rounded-full px-3 py-1 transition-all cursor-pointer focus:outline-none"
                    >
                        {/* Coin Icon */}
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-black ${selectedSymbol.includes('BTC') ? 'bg-[#f7931a]' :
                            selectedSymbol.includes('ETH') ? 'bg-[#627eea]' :
                                selectedSymbol.includes('SOL') ? 'bg-[#14f195]' :
                                    selectedSymbol.includes('XRP') ? 'bg-[#fff]' : 'bg-gray-400'
                            }`}>
                            {selectedSymbol.charAt(0)}
                        </div>

                        <span className="text-xs font-bold text-gray-200">{selectedSymbol}</span>

                        {/* Chevron */}
                        <svg className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full left-0 mt-1 w-32 bg-[#161616] border border-[#333] rounded-lg shadow-xl overflow-hidden py-1 z-[60]">
                            {SYMBOLS.map(symbol => (
                                <button
                                    key={symbol}
                                    onClick={() => {
                                        setSelectedSymbol(symbol);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-[#222] transition-colors flex items-center gap-2
                                        ${selectedSymbol === symbol ? 'text-white bg-[#1a1a1a]' : 'text-gray-400'}
                                    `}
                                >
                                    <div className={`w-2 h-2 rounded-full ${symbol.includes('BTC') ? 'bg-[#f7931a]' :
                                        symbol.includes('ETH') ? 'bg-[#627eea]' :
                                            symbol.includes('SOL') ? 'bg-[#14f195]' :
                                                symbol.includes('XRP') ? 'bg-[#fff]' : 'bg-gray-400'
                                        }`} />
                                    {symbol}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Connection Status */}
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full border ${connectionStatus === 'connected'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`} />
                <span className="text-[10px] uppercase font-bold tracking-wider">{connectionStatus}</span>
            </div>
        </div>
    );
};

export default React.memo(Header);
