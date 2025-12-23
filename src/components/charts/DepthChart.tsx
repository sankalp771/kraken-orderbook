
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useOrderbookStore } from '@/store/orderbook-store';

const DepthChart: React.FC = () => {
    const snapshot = useOrderbookStore(state => state.latestSnapshot);

    const option = useMemo(() => {
        if (!snapshot || snapshot.bids.length === 0 || snapshot.asks.length === 0) {
            return null;
        }

        const { bids, asks } = snapshot;
        const LEVELS_TO_SHOW = 100;

        // --- 1. PROCESS BIDS (Cumulative Volume) ---
        const sortedBids = [...bids].sort((a, b) => b.price - a.price);
        let currentBidVol = 0;
        const bidSeriesData = sortedBids.map(order => {
            currentBidVol += (order.volume || order.size || 0);
            return [order.price, currentBidVol];
        });
        const viewBids = bidSeriesData.slice(0, LEVELS_TO_SHOW).reverse();

        // --- 2. PROCESS ASKS (Cumulative Volume) ---
        const sortedAsks = [...asks].sort((a, b) => a.price - b.price);
        let currentAskVol = 0;
        const askSeriesData = sortedAsks.map(order => {
            currentAskVol += (order.volume || order.size || 0);
            return [order.price, currentAskVol];
        });
        const viewAsks = askSeriesData.slice(0, LEVELS_TO_SHOW);

        return {
            animation: false,
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                borderColor: '#333',
                textStyle: { color: '#eee' },
                valueFormatter: (value: number) => value.toFixed(4)
            },
            grid: {
                left: 0, right: 0, top: 10, bottom: 0, containLabel: false
            },
            xAxis: {
                type: 'value',
                scale: true,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: true, color: '#555', fontSize: 10, margin: 2, inside: true },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            },
            yAxis: {
                type: 'log',
                min: 0.1,
                position: 'right',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            series: [
                {
                    name: 'Bids',
                    type: 'line',
                    data: viewBids,
                    step: 'end',
                    symbol: 'none',
                    lineStyle: { width: 1.5, color: '#00e676' },
                    areaStyle: {
                        color: {
                            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(0, 230, 118, 0.5)' },
                                { offset: 1, color: 'rgba(0, 230, 118, 0.05)' }
                            ]
                        }
                    }
                },
                {
                    name: 'Asks',
                    type: 'line',
                    data: viewAsks,
                    step: 'end',
                    symbol: 'none',
                    lineStyle: { width: 1.5, color: '#ff5252' },
                    areaStyle: {
                        color: {
                            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(255, 82, 82, 0.5)' },
                                { offset: 1, color: 'rgba(255, 82, 82, 0.05)' }
                            ]
                        }
                    }
                }
            ]
        };
    }, [snapshot]);

    return (
        <div className="h-full w-full flex flex-col bg-[#0b0e11] relative overflow-hidden">
            {/* REMOVED INTERNAL HEADER - Now handled by Panel */}
            <div className="flex-1 w-full min-h-0">
                {option ? (
                    <ReactECharts
                        option={option}
                        style={{ height: '100%', width: '100%' }}
                        opts={{ renderer: 'canvas' }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full flex-col gap-2">
                        <div className="w-4 h-4 border-2 border-[#00e676] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
            <div className="absolute top-2 right-2 text-[9px] text-[#00e676]/50 font-mono pointer-events-none">LOG SCALE</div>
        </div>
    );
};

export default React.memo(DepthChart);
