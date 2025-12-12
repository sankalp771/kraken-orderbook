import { ViewState } from '@/types/orderbook';

export const exportStateToJSON = (state: ViewState) => {
    try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `orderbook_snapshot_${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        console.log("Snapshot exported successfully");
    } catch (e) {
        console.error("Export failed", e);
    }
};

export const importStateFromJSON = async (file: File): Promise<ViewState | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                resolve(json as ViewState);
            } catch (e) {
                reject(e);
            }
        };
        reader.readAsText(file);
    });
};
