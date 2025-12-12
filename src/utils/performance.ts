export const measurePerformance = (label: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    if (end - start > 16) { // Warn if frame budget exceeded
        console.warn(`[Perf] ${label} took ${end - start}ms`);
    }
};

export class LatencyMonitor {
    private pings: number[] = [];

    add(latency: number) {
        this.pings.push(latency);
        if (this.pings.length > 50) this.pings.shift();
    }

    getAverage(): number {
        if (this.pings.length === 0) return 0;
        return this.pings.reduce((a, b) => a + b, 0) / this.pings.length;
    }
}
