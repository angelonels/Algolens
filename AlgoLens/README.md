# AlgoLens: Interactive Algorithm Visualizer

AlgoLens is a digital learning tool designed to make complex algorithms easy to understand for everyone. By using high-quality, step-by-step interactive animations, AlgoLens helps you see exactly how algorithms work under the hood. Whether you are a student learning computer science or simply a curious mind wanting to understand how computers solve problems, AlgoLens brings data and logic to life.

## Key Features

- **Interactive Animations**: Watch data sort, search, and navigate in real-time with visually stunning representations.
- **Full Playback Controls**: Play, pause, resume, and step backward or forward through the algorithm's lifecycle at your own pace.
- **Speed Adjustments**: Slow down the visualizations to understand every single step, or speed them up to see the big picture.
- **Real-time Metrics**: Step counters and live statistics track comparisons, swaps, operations, and other algorithm-specific metrics.
- **Comprehensive Explainers**: Simple, analogy-driven explanations for each algorithm, including real-world use cases, time/space complexity, and key characteristics.

## Supported Visualizers

### Machine Learning
- **Linear Regression**: Gradient descent fitting (watch the line converge)
- **Logistic Regression**: Sigmoid decision boundaries with binary classification
- **Decision Tree**: Recursive feature-space partitioning
- **K-Means Clustering**: Unsupervised partitioning into clusters

### Graph & Pathfinding
- **Breadth-First Search (BFS)**: Layer-by-layer grid exploration
- **Depth-First Search (DFS)**: Stack-based depth exploration with backtracking
- **Dijkstra's Algorithm**: Finding the shortest path in weighted graphs
- **A* Pathfinding**: Heuristic-guided optimal search

### Sorting & Searching
- **Bubble Sort**, **Insertion Sort**, **Merge Sort**, and **Quick Sort**
- **Algorithm Race**: Pit two sorting algorithms head-to-head
- **Binary Search**: Divide and conquer on sorted arrays

### Dynamic Programming & Math
- **Edit Distance**: Minimum operations to transform strings
- **Euclidean GCD**: Finding the greatest common divisor
- **Matrix Traversal**: Row-major, column-major, and diagonal walks

## Tech Stack

- **React 19 & Vite**: Fast, modern frontend architecture.
- **Framer Motion**: Powering the advanced, robust animation engine.
- **React Router**: For seamless navigation between different algorithms.

## Project Structure

- `src/components/`: Core application layout, routing, and the Home dashboard.
- `src/visualizers/`: The individual algorithm visualization logic and rendering components.
- `src/ui/` or `src/components/ui/`: Reusable interface components like generic playback control bars.
- `src/utils/`: Shared helper functions and logic across algorithms.

## Quick Start (Local Development)

To run AlgoLens on your own machine, open your terminal and follow these commands:

1. **Install required dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```

3. Open the local address provided in your terminal (usually `http://localhost:5173`) in your web browser.
