import { exportStateToJSON } from '@/utils/export';
import { useOrderbookStore } from '@/store/orderbook-store';

export default function ExportButton() {
    const latestSnapshot = useOrderbookStore(state => state.latestSnapshot);

    const handleExport = () => {
        if (latestSnapshot) {
            exportStateToJSON(latestSnapshot);
        }
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded transition-colors border border-gray-700"
            title="Export snapshot to JSON"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export
        </button>
    );
}
