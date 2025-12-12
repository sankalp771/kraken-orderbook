# Real-Time Orderbook Visualizer

**Track 2 Solution** | High-performance React application utilizing Web Workers and Canvas for visualizing Kraken V2 market data.

![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-green)

## Features

- 🚀 **Dual-Thread Architecture**: Processing in Worker, rendering in Main.
- 📉 **Real-Time Depth Chart**: High-performance Canvas rendering.
- ⏪ **Time Travel**: Instant replay of orderbook states.
- 📊 **Order Flow Indicator**: Visual buy/sell pressure imbalance.
- ⚡ **Kraken V2 API**: Full integration with the latest WebSocket standards.

## Installation

```bash
git clone https://github.com/your-repo/kraken-orderbook.git
cd kraken-orderbook
npm install
```

## Running

### Simulated Mode (Default)
Useful for offline development or testing specific scenarios.
```bash
npm run dev
# Toggle 'Use Simulated' in code or UI if available
```

### Live Kraken Feed
1. Open `src/hooks/useOrderbookWorker.ts` (or UI toggle).
2. Set `useSimulated` to `false`.
3. Default symbol is `BTC/USD`.

## Usage Guide

### Time Travel
- **Pause**: Press `Space` or click "Switch to Replay".
- **Seek**: Drag the slider or use `←` / `→` arrow keys.
- **Resume**: Press `R` or click "Return to Live".

### Exporting Data
- Click the **Export** button in the top control bar to download the current snapshot as JSON.

## Hackathon Demo Script

1. **Load Page**: Show the "Connecting..." status turning into "Connected".
2. **Visuals**: Point out the Green/Red heatmap and the smoothness of the updates.
3. **Stress Test**: Open DevTools, verify 60fps.
4. **Time Travel**: 
   - Wait for a large price move.
   - Hit **Space** (Pause).
   - Drag slider back to see the move happen again clearly.
5. **Depth Chart**: Resize window to show the chart resizing instantly without lag.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Testing**: Vitest
