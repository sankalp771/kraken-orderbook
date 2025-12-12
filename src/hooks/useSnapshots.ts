// Skeleton hook for future snapshot integration
export function useSnapshots() {
    // TODO: access snapshot history from worker via request/response pattern
    const playHistory = () => { console.log('play history stub'); };
    const pauseHistory = () => { console.log('pause history stub'); };

    return {
        playHistory,
        pauseHistory
    };
}
