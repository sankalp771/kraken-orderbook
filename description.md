# 🏆 Kraken Orderbook Visualizer with Time Travel

**Track:** Orderbook Visualizer (Track #2)

---

## 1. Clear Problem Statement

Orderbook data is highly dynamic and difficult to reason about in real time, especially during periods of high volatility. While traders rely on market depth to understand liquidity, most tools do not allow developers or traders to inspect how liquidity *evolved* over time. This makes it difficult to analyze missed opportunities, sudden liquidity shifts, or market microstructure behavior.

---

## 2. What I Built

I built a **high-performance web-based orderbook visualizer** that connects directly to **Kraken’s WebSocket API (v2)** and enables **real-time market depth analysis with historical time travel**. The application allows users to view live bid/ask depth, pause the market, scrub backward through recent orderbook states, and instantly jump back to live data — all without freezing the UI.

What makes this unique is the **snapshot-based time travel engine**, which allows deterministic inspection of historical orderbook states rather than replaying unreliable event streams.

---

## 3. Key Features

* 🔴🟢 **Real-time Bid/Ask Orderbook** powered by Kraken WS API v2
* 📊 **Market Depth Chart** with cumulative volume and logarithmic scaling
* ⏪ **Time Travel Slider** to scrub through historical orderbook snapshots (~60s buffer)
* ❄️ **Frozen Snapshot Playback** for accurate inspection of past market states
* 🔁 **Jump-to-Live** for instant return to real-time streaming data
* ⚡ **Web Worker Architecture** ensuring smooth UI during high-frequency updates
* 🌙 **Professional Trading Terminal UI** inspired by Kraken Pro / Bybit

---

## 4. Technical Highlights

The application is built using **React + TypeScript + Vite**, with **Zustand** for transient state management and **ECharts (Canvas)** for high-performance visualization. All WebSocket ingestion, delta merging, snapshotting, and cumulative depth calculations are executed inside a **dedicated Web Worker**, keeping the main thread responsive even under heavy market activity.

A **ring buffer snapshot system** is used to maintain a fixed-memory time travel window, prioritizing low latency and determinism over long-term storage. Logarithmic scaling is applied to depth charts to prevent large liquidity walls from visually flattening meaningful market structure.

---

## 5. How It Works

1. The application connects to Kraken’s WebSocket v2 feed and streams live orderbook updates.
2. A Web Worker processes deltas, maintains bid/ask maps, and periodically stores full orderbook snapshots in a circular buffer.
3. The UI renders the latest snapshot in real time.
4. When the user drags the **Time Travel slider**, the UI switches to historical snapshots and freezes the view.
5. Clicking **Jump to Live** instantly reconnects the UI to the latest market state.

---

## 6. Demo & Documentation

* 🚀 **Live Demo:** [https://kraken-orderbook-ipk4.vercel.app/](https://kraken-orderbook-ipk4.vercel.app/)
* 🎥 **Video Walkthrough:** [https://youtu.be/DIAXjU9UTC4](https://youtu.be/DIAXjU9UTC4)
* 📚 **Documentation:**
  * [Architecture & Time Travel Engine](https://github.com/sankalp771/kraken-orderbook/blob/main/docs/ARCHITECTURE.md)
  * [Orderbook Math & Liquidity Concepts](https://github.com/sankalp771/kraken-orderbook/blob/main/docs/ORDERBOOK_MATH.md)
  * Clean, well-structured README with setup instructions

Screenshots and explanations are included directly in the repository.

---

## 7. Future Enhancements (Optional)

* Persistent historical storage using IndexedDB for multi-hour analysis
* Configurable snapshot frequency vs memory usage
* Liquidity heatmap overlays across time
* Advanced order flow imbalance indicators
* SDK extraction for reuse in other trading dashboards

---

### ✅ Why this fits Kraken Forge

This project demonstrates **orderbook intelligence**, **low-latency architecture**, and **thoughtful engineering tradeoffs** — closely aligned with the real-world systems Kraken engineers build and maintain.
