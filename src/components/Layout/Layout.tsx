import React from 'react';
import Panel from '@/components/common/Panel';

interface LayoutProps {
    header: React.ReactNode;
    timeTravel: React.ReactNode;
    orderbook: React.ReactNode;
    chart: React.ReactNode;
    trades: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, timeTravel, orderbook, chart, trades }) => {
    return (
        <div className="h-screen w-screen flex flex-col bg-[#000000] text-white overflow-hidden font-sans">
            {/* Header */}
            <div className="flex-shrink-0 z-50">
                {header}
            </div>

            {/* Time Travel Bar */}
            <div className="flex-shrink-0 border-b border-[#1e2329] bg-[#0b0e11] py-1">
                {timeTravel}
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 flex flex-col p-2 gap-2 min-h-0">

                {/* Top Row: Orderbook + Chart */}
                <div className="flex-1 flex gap-2 min-h-0">
                    {/* Orderbook Panel */}
                    <Panel title="Order Book" className="w-[320px] flex-shrink-0">
                        {orderbook}
                    </Panel>

                    {/* Chart Panel */}
                    <Panel title="Market Depth" className="flex-1">
                        {chart}
                    </Panel>
                </div>

                {/* Bottom Row: Trades */}
                <Panel title="Recent Trades" className="h-[220px] flex-shrink-0">
                    {trades}
                </Panel>

            </div>
        </div>
    );
};

export default React.memo(Layout);
