# 🏆 Kraken Orderbook Visualizer with Time Travel

A high-performance web-based orderbook visualizer built on Kraken’s WebSocket API, enabling real-time market depth analysis and historical time travel. Built for **Kraken Forge Hackathon (Track #2)**.

**🚀 Live Demo:** [https://kraken-orderbook-ipk4.vercel.app/](https://kraken-orderbook-ipk4.vercel.app/)

## 🚀 Why this project?

Orderbooks are highly dynamic and difficult to reason about in real time. In high-frequency markets, alpha is often found in the moments we miss—a flash crash, a sudden wall of liquidity, or a cascading liquidation.

This project focuses on:
- **Making market liquidity visually intuitive** with professional-grade depth charts.
- **Allowing traders to rewind** and inspect historical orderbook states with millisecond precision.
- **Providing a reusable, documented visualization component** ready for production dashboards.

## ✨ Features

- 🔴🟢 **Real-time Bid/Ask Orderbook** via Kraken WS API (v2).
- 📊 **Market Depth Visualization** using Logarithmic scaling for deep liquidity analysis.
- ⏪ **Time Travel Engine** to scrub back through recent market history (~60s buffer).
- ❄️ **Snapshot-based Playback** allowing inspection of "frozen" market states.
- 🔁 **Jump-to-Live** functionality for instant return to real-time data.
- 🔄 **Multi-symbol Support** (BTC/USD, ETH/USD, SOL/USD, XRP/USD).
- 🌙 **Judge-Ready Dark Mode UI** inspired by professional trading terminals.
- ⚡ **Web Worker Architecture** for off-main-thread data processing.

## 🚀 Quick Start

To run the project locally:

```bash
git clone https://github.com/sankalp771/kraken-orderbook.git
cd kraken-orderbook
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎥 Demo Video

> **https://youtu.be/DIAXjU9UTC4**

The video walks through:
- Live orderbook updates.
- Market depth interpretation.
- Time travel usage.
- Jump-to-live behavior.

## 📸 Screenshots

### Live Orderbook & Time Travel Panel & Market Depth
![Time Travel Panel](<img width="1919" height="910" alt="Screenshot 2025-12-24 212947" src="https://github.com/user-attachments/assets/53496cb5-05fd-4c53-a750-ef9a314dc9e9" />
)


## ⏳ How Time Travel Works

The time travel feature is engineered for performance using a **ring buffer snapshot system**:

1.  **Worker-Side Buffering:** Live WebSocket updates are processed in a dedicated Web Worker.
2.  **Snapshotting:** The worker maintains a circular buffer of full orderbook states (snapshots) taken at high-frequency intervals.
3.  **UI Mapping:** The Time Travel slider maps directly to these snapshot indices.
4.  **Replay:** When dragging the slider, the UI disconnects from the live stream and renders the frozen state from the buffer.
5.  **Live Restore:** Clicking "Jump to Live" instantly reconnects the UI to the latest real-time frame.

## 🧠 Design Decisions

- **Snapshots over event replay:** Chosen to avoid WebSocket sequence desync and simplify rendering logic.
- **~60s ring buffer:** Chosen to balance high-fidelity memory usage (~100MB max) with sufficient interactivity for recent market analysis.
- **Canvas-based charts:** ECharts (Canvas) was preferred over SVG to ensure high performance during 60fps redraws.
- **Worker-Thread Processing:** All diffing logic is offloaded to a Web Worker to ensure the UI thread never freezes, even during high-volatility events.

## 🛠 Tech Stack

- **Frontend:** React + TypeScript
- **Build Tool:** Vite
- **State Management:** Zustand (transient updates)
- **Visualization:** ECharts (Canvas-based rendering)
- **Styling:** Tailwind CSS (Strict grid layout)
- **Data Processing:** Web Workers (Off-main-thread processing)

## 📂 Project Structure

```
src/
├── components/          # UI Components
│   ├── charts/          # Visualization (DepthChart)
│   ├── common/          # Shared atomic components (Panel)
│   ├── Controls/        # Action buttons (ExportButton)
│   ├── Layout/          # Main application shell (Header, Layout)
│   ├── OrderBook/       # Orderbook grid & rows (OrderBookTable)
│   ├── OrderFlow/       # Order flow indicators
│   ├── TimeTravel/      # Playback controls (TimeTravelSlider)
│   └── Trades/          # Recent trades list
├── hooks/               # Custom React Hooks
│   ├── useKeyboardShortcuts.ts
│   ├── useOrderbookWorker.ts
│   ├── useSnapshots.ts
│   └── useWebSocket.ts
├── services/            # API services (KrakenWS)
├── store/               # Zustand state management
│   └── orderbook-store.ts
├── styles/              # Global CSS & Tailwind setup
├── types/               # TypeScript interfaces
├── utils/               # Helper functions
├── workers/             # Dedicated Web Workers
│   └── orderbook.worker.ts
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## 🧩 Reusability

This project is designed as a modular ecosystem. Core components such as `OrderBook`, `DepthChart`, and the `TimeTravel` logic are decoupled and can be extracted to power other trading dashboards or analytics tools.

## 🔮 Limitations & Future Improvements

**This limitation is a deliberate design choice prioritizing low-latency performance over long-term storage.**

- **Longer History:** Implementing IndexedDB for persistent storage of longer timeframes (hours/days).
- **Custom Intervals:** Allowing users to configure snapshot frequency vs. memory usage.
- **Heatmap:** Adding a heatmap layer to visualize historical liquidity density over time.
- **Order Flow:** integrating deeper order flow imbalance indicators.

## 📜 License

This project is licensed under the MIT License.
