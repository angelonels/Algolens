# AlgoLens

A visual playground for understanding algorithms. Pick an algorithm, watch it run step by step, and finally get why it works.

## What's inside

- **Binary Search** – Find elements with pointer indicators and range highlighting
- **Bubble Sort** – Bar chart visualization with swap animations
- **Insertion Sort** – Key extraction and shift visualization
- **Merge Sort** – Split/merge phases with recursion depth tracking
- **Quick Sort** – Pivot selection with partition range display
- **Euclidean GCD** – Animated number boxes showing modulo operations
- **Matrix Traversal** – Spiral traversal with layer coloring
- **Dijkstra's Path** – Interactive graph with shortest path exploration

## Features

- 🎛️ Speed controls (0.5x – 4x)
- ⏸️ Pause/Resume animations
- 📊 Step counter with progress
- 📝 Python code snippets with copy button
- 🎨 Color-coded state legends
- ✨ Smooth Framer Motion animations

## Tech

- React 19
- Vite
- React Router
- Framer Motion

## Project structure

```
src/
  components/
    Home.jsx
    Navbar.jsx
    ui/
      AnimationComponents.jsx
  visualizers/
    BinarySearch.jsx
    BubbleSort.jsx
    InsertionSort.jsx
    MergeSort.jsx
    QuickSort.jsx
    EuclideanGCD.jsx
    MatrixTraversal.jsx
    DijkstraPath.jsx
  utils/
    animationConfig.js
  App.jsx
  main.jsx
  index.css
```

## Running locally

```bash
cd AlgoLens
npm install
npm run dev
```

Opens at `http://localhost:5173`
