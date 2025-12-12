# Architecture Documentation

## Overview

The Kraken Orderbook Visualizer uses a **Main Thread / Web Worker** architecture to ensure UI responsiveness (60 FPS) regardless of the WebSocket message volume.

### Worker Pipeline

1. **Ingestion**: `WebSocketService` receives raw Kraken v2 messages.
2. **Buffering**: Updates are buffered into a `MessageQueue`.
3. **Engine**: `OrderbookEngine` applies updates to internal `Map<Price, Volume>`.
4. **Tick Loop**: A `setInterval` loop (approx 10-15 FPS) snapshots the engine state.
5. **View Projection**: `getL2View` computes the top 50 depth, sorts them, and calculates cumulative volume.
6. **Transmission**: The serialized `ViewState` is `postMessage`'d to the Main Thread.
7. **Archival**: The snapshot is also pushed to `SnapshotManager` (Ring Buffer) for Time Travel.

### Frontend Layers

- **Zustand Store**: Receives the `TICK` and updates `latestTick`.
- **UI Components**:
  - `OrderBookTable`: Virtualized list (mapped to `latestTick.bids/asks`).
  - `DepthChart`: Canvas 2D, redrawn on `latestTick` change.
  - `TimeTravel`: Controls sending navigation commands to worker.

## Data Structures

- **Bids/Asks**: `Map<Price, Volume>` for O(1) reads/writes.
- **Snapshot Buffer**: `RingBuffer` (Array with wrapping index) to store history without allocation churn.

## Key Decisions

- **Canvas vs SVG**: Canvas chosen for Depth Chart due to frequent full-redraw requirements (10-60Hz).
- **Worker**: Essential to prevent JS Garbage Collection pauses or calculation blocks from freezing the UI.
