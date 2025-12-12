export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let inThrottle: boolean = false;
    let lastRan: number;

    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            lastRan = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastRan); // actually this logic is debounce/throttle mix, strict throttle ignores calls in window
            // Let's implement strict throttle
        }
    } as T;
}

// Simple rate limiter for worker fps
export class RateLimiter {
    private lastRun: number = 0;
    private interval: number;

    constructor(limitMs: number) {
        this.interval = limitMs;
    }

    canRun(): boolean {
        const now = performance.now();
        if (now - this.lastRun >= this.interval) {
            this.lastRun = now;
            return true;
        }
        return false;
    }

    setInterval(ms: number) {
        this.interval = ms;
    }
}
