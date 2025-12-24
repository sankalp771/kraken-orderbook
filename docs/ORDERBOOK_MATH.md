# 🧮 Orderbook Math & Market Mechanics

This document explains the financial concepts and mathematical logic used to generate the visualizations in this project.

## 📊 What is Cumulative Depth?

A standard orderbook lists raw liquidity at specific price levels:
- Price $95,000: 2.5 BTC
- Price $95,005: 1.0 BTC

However, showing raw bars is often misleading.
**Cumulative Depth** answers the question: *"How much can I buy/sell before pushing the price to level X?"*

### The Algorithm
We iterate through the sorted orderbook:
- Level 1: Volume = 2.5 (Cumulative = 2.5)
- Level 2: Volume = 1.0 (Cumulative = 3.5)
- Level 3: Volume = 0.5 (Cumulative = 4.0)

**Why this matters:**
This creates the "mountain" shape you see in the chart. Steep walls indicate strong support/resistance zones, while flat slopes indicate thin liquidity where price can slip easily.

## 📈 Why Logarithmic Scaling?

In crypto markets, liquidity is often uneven.
- A "Whale" might place a massive buy wall (e.g., 500 BTC) at a low price.
- Normal traders place small orders (0.1 BTC, 0.5 BTC) near the spread.

### The Linear Problem
If we use a linear Y-axis, the 500 BTC wall will be huge, and the 0.5 BTC orders will look like a flat line (0 pixels high). You lose all detail near the spread—where trading actually happens.

### The Log-Scale Solution
We apply a logarithmic transform to the Y-axis (Volume).
$$ Y = \log_{10}(\text{Volume}) $$

This compresses the massive outliers and expands the small values.
**Result:** You can see BOTH the massive whale walls far away AND the granular microstructure near the current price.

## 🟢🔴 The Bid-Ask Spread

The **Spread** is the gap between:
- **Best Bid (Green):** The highest price someone is willing to pay.
- **Best Ask (Red):** The lowest price someone is willing to sell for.

**Calculation:**
$$ \text{Spread} = \text{Best Ask} - \text{Best Bid} $$
$$ \text{Spread \%} = (\text{Spread} / \text{Best Ask}) \times 100 $$

A tight spread (near 0.01%) indicates a highly liquid, efficient market. A wide spread indicates low liquidity or high volatility.
Our visualizer highlights this "No Man's Land" in the center of the chart.
