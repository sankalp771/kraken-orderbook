import React from 'react';
import { useOrderbookWorker } from '@/hooks/useOrderbookWorker';
import { useOrderbookStore } from '@/store/orderbook-store';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import OrderbookTable from '@/components/orderbook/OrderbookTable';
import DepthChart from '@/components/charts/DepthChart';
import TradesPanel from '@/components/trades/TradesPanel';

function App() {
    // Get selected symbol from store
    const selectedSymbol = useOrderbookStore(state => state.selectedSymbol);

    // Initialize worker (will re-initialize when symbol changes)
    useOrderbookWorker(selectedSymbol, false); // false = live Kraken data

    return (
        <Layout
            header={<Header />}
            orderbook={<OrderbookTable />}
            chart={<DepthChart />}
            trades={<TradesPanel />}
        />
    );
}

export default App;
