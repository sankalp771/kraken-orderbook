import React from 'react';

interface LayoutProps {
    header: React.ReactNode;
    orderbook: React.ReactNode;
    chart: React.ReactNode;
    trades: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, orderbook, chart, trades }) => {
    return (
        <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden">
            {/* Header */}
            <div className="h-14 flex-shrink-0 border-b border-[#2a2a2a] bg-[#0b0e11]">
                {header}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0">

                {/* TOP: CHART (60% Height) */}
                <div className="flex-[3] min-h-0 border-b border-[#2a2a2a] bg-[#0b0e11] w-full relative">
                    {chart}
                </div>

                {/* BOTTOM: DATA TABLES (40% Height) - FORCED SIDE-BY-SIDE */}
                <div className="flex-[2] min-h-0 flex flex-row w-full bg-[#0b0e11]">

                    {/* Bottom Left: Orderbook (50% Width) */}
                    <div className="w-1/2 border-r border-[#2a2a2a] flex flex-col min-h-0">
                        <div className="flex-shrink-0 px-3 py-2 border-b border-[#2a2a2a] bg-[#161a1e] text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Order Book
                        </div>
                        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                            {orderbook}
                        </div>
                    </div>

                    {/* Bottom Right: Trades (50% Width) */}
                    <div className="w-1/2 flex flex-col min-h-0">
                        <div className="flex-shrink-0 px-3 py-2 border-b border-[#2a2a2a] bg-[#161a1e] text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Recent Trades
                        </div>
                        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                            {trades}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default React.memo(Layout);
