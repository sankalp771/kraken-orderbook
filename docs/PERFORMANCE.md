# Performance Optimization Strategy

## Throughput Targets
- **WebSocket**: Ability to handle 500+ updates/sec.
- **Rendering**: Consistent 60fps UI.

## Techniques Implemented

### 1. Off-Main-Thread Architecture
All heavy lifting (JSON parsing, Map updates, Sorting, Cumulative Sums) happens in a dedicated Web Worker. The Main Thread behaves purely as a "View Layer," receiving ready-to-render objects.

### 2. Throttling / Frame Capping
We do not attempt to render every single socket update (which can burst >100ms). Instead, the worker buffers updates and emits a "UI Frame" at a fixed rate (e.g., 15fps or 30fps). This matches human perception limits while saving CPU.

### 3. Object Recycling (Planned for V2)
Currently, `ViewState` objects are allocated fresh each tick. For extreme performance, we would use an `SharedArrayBuffer` or Object Pools to eliminate GC pressure.

### 4. React Memoization
`OrderBookRow` is wrapped in `React.memo` with a custom comparator. It only re-renders if the `price` or `volume` or `total` actually changes.

### 5. Canvas for Charts
`DepthChart` uses HTML5 Canvas `2d`. Re-rendering 50-100 polygon points is trivial for the GPU/CPU compared to managing 100 DOM nodes in SVG.

## Benchmarks (Dev Environment)
- **Latency**: Approx 5-10ms added by Worker serialization.
- **FPS**: Stable 60fps on M1 Macbook Air during simulated stress test (50ms interval).
