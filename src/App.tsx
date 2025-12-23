import React from 'react';
import { useOrderbookWorker } from '@/hooks/useOrderbookWorker';
import { useOrderbookStore } from '@/store/orderbook-store';
import Layout from '@/components/Layout/Layout';
import Header from '@/components/Layout/Header';
import OrderbookTable from '@/components/orderbook/OrderbookTable';
import DepthChart from '@/components/charts/DepthChart';
import TradesPanel from '@/components/trades/TradesPanel';

import TimeTravelSlider from '@/components/Layout/TimeTravelSlider';

function App() {
    // Get selected symbol from store
    const selectedSymbol = useOrderbookStore(state => state.selectedSymbol);

    // Initialize worker (will re-initialize when symbol changes)
    useOrderbookWorker(selectedSymbol, false); // false = live Kraken data

    return (
        <Layout
            header={<Header />}
            timeTravel={
                <div className="flex items-center justify-center py-1">
                    <TimeTravelSlider />
                </div>
            }
            orderbook={<OrderbookTable />}
            chart={<DepthChart />}
            trades={<TradesPanel />}
        />
    );
}

export default App;
