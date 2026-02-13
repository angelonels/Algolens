# AlgoLens

A visual playground for understanding algorithms — built with a Swiss-Style / Neobrutalist design system.

Pick an algorithm, watch it run step by step, and finally get why it works.

## Design

AlgoLens uses a custom-built design system that prioritizes clarity and intentionality:

- **Typography** — JetBrains Mono for headings and labels, Inter for body text
- **Color palette** — Warm ivory (`#f5f0e8`), near-black (`#0a0a0a`), electric vermillion (`#e63312`)
- **Layout** — Sharp corners (`0–2px` radii), `1px` solid borders instead of shadows, zero gradients
- **Motion** — Snappy `150ms` transitions with `cubic-bezier(0.16, 1, 0.3, 1)` easing

## What's inside

- **Binary Search** – Pointer indicators with range highlighting on a sorted array
- **Bubble Sort** – Bar chart visualization with swap animations
- **Insertion Sort** – Key extraction and shift visualization
- **Merge Sort** – Split/merge phases with recursion depth tracking
- **Quick Sort** – Pivot selection with partition range display
- **Euclidean GCD** – Animated value cards showing modulo operations
- **Matrix Traversal** – Spiral traversal with layer coloring
- **Dijkstra's Path** – Interactive SVG graph with shortest path exploration
- **BFS Grid Search** – Interactive grid pathfinding with wall drawing and layer-by-layer exploration

## Features

- Speed controls (slow, normal, fast, turbo)
- Pause/resume animations
- Step counter with progress tracking
- Python code snippets with copy button
- Color-coded state legends
- Smooth Framer Motion spring animations

## Tech

- React 19
- Vite
- React Router
- Framer Motion
- Google Fonts (Inter, JetBrains Mono)

## Project structure

```
src/
  components/
    Home.jsx           # Editorial landing page with algorithm grid
    Navbar.jsx          # Fixed nav bar with split wordmark + dropdown
    ui/
      AnimationComponents.jsx  # Atomic UI component library
  visualizers/
    BinarySearch.jsx
    BubbleSort.jsx
    InsertionSort.jsx
    MergeSort.jsx
    QuickSort.jsx
    EuclideanGCD.jsx
    MatrixTraversal.jsx
    DijkstraPath.jsx
    BFSGrid.jsx
  utils/
    animationConfig.js  # Design tokens: colors, springs, styles
  App.jsx
  main.jsx
  index.css             # Global design system (CSS custom properties)
```

## Running locally

```bash
cd AlgoLens
npm install
npm run dev
```

Opens at `http://localhost:5173`
