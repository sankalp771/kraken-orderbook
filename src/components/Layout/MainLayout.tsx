import React from 'react';
import HeaderBar from './HeaderBar';

// Visual Reference 1: 3-Column Layout
// Left: Orderbook | Center: Charts | Right: Trades/Details
// But standard trading layout often puts Chart first. 
// The prompt asks for: Orderbook | DepthChart | Orderflow/Trades
// We will implement that grid.

interface MainLayoutProps {
    children?: React.ReactNode;
    orderbookSlot?: React.ReactNode;
    chartSlot?: React.ReactNode;
    tradesSlot?: React.ReactNode;
    bottomSlot?: React.ReactNode;
}

export default function MainLayout({ orderbookSlot, chartSlot, tradesSlot, bottomSlot }: MainLayoutProps) {
    return (
        <div className="flex flex-col h-screen bg-[#000000] text-[#e0e0e0] font-sans overflow-hidden selection:bg-blue-500/30">
            <HeaderBar />

            {/* Main Grid Content */}
            <div className="flex-1 grid grid-cols-12 gap-1 p-1 min-h-0">

                {/* Column 1: Orderbook (Fixed width approx 300-350px ideally, but using cols for responsiveness) */}
                <div className="col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-3 flex flex-col bg-[#121212] rounded border border-[#2a2a2a] overflow-hidden">
                    <div className="bg-[#1e1e1e] text-xs font-bold text-gray-400 px-3 py-1.5 border-b border-[#2a2a2a]">
                        ORDER BOOK
                    </div>
                    <div className="flex-1 relative min-h-0">
                        {orderbookSlot || <div className="p-4 text-center text-gray-600 text-xs">Waiting for Orderbook...</div>}
                    </div>
                </div>

                {/* Column 2: Depth Chart (Flexible width, largest) */}
                <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 flex flex-col bg-[#121212] rounded border border-[#2a2a2a] overflow-hidden">
                    <div className="bg-[#1e1e1e] text-xs font-bold text-gray-400 px-3 py-1.5 border-b border-[#2a2a2a] flex justify-between">
                        <span>DEPTH CHART</span>
                        <span className="text-[10px] text-gray-600">CANVAS 2D</span>
                    </div>
                    <div className="flex-1 relative min-h-0 flex flex-col">
                        {chartSlot || <div className="p-4 text-center text-gray-600 text-xs">Waiting for Chart...</div>}
                    </div>
                </div>

                {/* Column 3: Trades / Orderflow (Fixed width) */}
                <div className="col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-3 flex flex-col bg-[#121212] rounded border border-[#2a2a2a] overflow-hidden">
                    <div className="bg-[#1e1e1e] text-xs font-bold text-gray-400 px-3 py-1.5 border-b border-[#2a2a2a]">
                        RECENT TRADES
                    </div>
                    <div className="flex-1 relative min-h-0">
                        {tradesSlot || <div className="p-4 text-center text-gray-600 text-xs">Waiting for Trades...</div>}
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Time Travel */}
            <div className="h-16 bg-[#121212] border-t border-[#2a2a2a] px-4 flex items-center">
                {bottomSlot}
            </div>
        </div>
    );
}
