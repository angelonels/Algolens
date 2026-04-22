# AlgoLens 🔍

[![CI Status](https://github.com/angelonels/Algolens/actions/workflows/ci.yml/badge.svg)](https://github.com/angelonels/Algolens/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React 19](https://img.shields.io/badge/React-19.0-blue.svg?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4.0-38bdf8.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**See how algorithms actually work — step by step, right in your browser.**

Ever read about sorting or search algorithms and thought _"but what is it actually doing?"_ AlgoLens lets you watch them run in real time with slick, butter-smooth animations, so you can build strong, lasting visual intuition.

[**Live Demo**](https://angelonels.github.io/Algolens) • [**Report Bug**](https://github.com/angelonels/Algolens/issues/new?template=bug_report.md) • [**Request Feature**](https://github.com/angelonels/Algolens/issues/new?template=feature_request.md)

---

## 🎨 Interactive Visualizer Categories

AlgoLens currently features **17 algorithm visualizers** across five key domains, complete with step counts, status logs, custom speed options, and live python code snippets.

### 📊 Sorting Algorithms

| Algorithm          | Visual Behavior                                         | Complexity (Worst) |
| :----------------- | :------------------------------------------------------ | :----------------- |
| **Bubble Sort**    | Adjacent bars compare and swap until sorted             | $O(N^2)$           |
| **Insertion Sort** | Iteratively slides elements into their correct position | $O(N^2)$           |
| **Selection Sort** | Finds the minimum element and places it at the boundary | $O(N^2)$           |
| **Merge Sort**     | Recursively divides arrays and merges sorted subgroups  | $O(N \log N)$      |
| **Quick Sort**     | Partitions arrays around a pivot element recursively    | $O(N^2)$           |
| **Heap Sort**      | Builds a binary max-heap and extracts root elements     | $O(N \log N)$      |

### 🔍 Searching & Pathfinding

| Algorithm                | Visual Behavior                                          | Best For                     |
| :----------------------- | :------------------------------------------------------- | :--------------------------- |
| **Binary Search**        | Pointers narrow down in halves on a sorted list          | Sorted arrays                |
| **BFS (Breadth-First)**  | Explores coordinates level by level outwards             | Shortest paths, unweighted   |
| **DFS (Depth-First)**    | Explores coordinates along branches before backtracking  | Connectivity, puzzle solving |
| **Dijkstra's Algorithm** | Explores weighted routes greedily based on current costs | Shortest path, weighted      |

### 🧮 Math & Dynamic Programming

| Algorithm              | Visual Behavior                                             | Domain                |
| :--------------------- | :---------------------------------------------------------- | :-------------------- |
| **Euclidean GCD**      | Iteratively modulos numbers to find Greatest Common Divisor | Number Theory         |
| **Matrix Traversal**   | Row-major, column-major, and diagonal walks across grids    | Array manipulation    |
| **Edit Distance (DP)** | Builds a grid showing minimal string transformations        | NLP / Text comparison |

### 🤖 Machine Learning

| Algorithm               | Visual Behavior                                         | Domain                    |
| :---------------------- | :------------------------------------------------------ | :------------------------ |
| **K-Means Clustering**  | Centroids update positions until clusters settle        | Unsupervised clustering   |
| **Linear Regression**   | A line converges onto points using gradient descent     | Supervised regression     |
| **Logistic Regression** | Sigmoid decision boundary splits binary classifications | Supervised classification |
| **Decision Tree**       | Recursively partitions coordinate spaces                | Supervised classification |

---

## ✨ Features

- ⏩ **Full Playback & Speed Controls**: Adjust playback speed ($0.5\times$, $1\times$, $2\times$, $4\times$) and play, pause, step forward, or step backward.
- 🐍 **Python Code Snippets**: Learn the theory alongside the visuals. Every page has clean, highlightable Python reference code.
- ⌨️ **Keyboard Shortcuts**: Control playback, navigate sections, and trigger steps entirely from your keyboard.
- 🎨 **Theme Toggle**: Full light and dark mode integration using Tailwind CSS v4 custom variables.
- 💫 **Buttery Transitions**: Built with Framer Motion spring physics for performance-focused animations.
- 🛡️ **Defensive Inputs**: Validates user configurations (custom array inputs, matrix dimensions) so the UI never crashes.

---

## 🛠️ Tech Stack

- **React 19**: Rendering library.
- **TypeScript**: Strict type checking.
- **Vite**: Frontend toolchain and dev server.
- **Tailwind CSS v4**: Theme styling and layouts.
- **Framer Motion**: Spring-physics animation engine.
- **React Router**: Client-side routing.
- **Vitest**: Fast test runner.
- **React Testing Library**: Component and DOM validation.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org) (v20 or higher recommended) and `npm` installed.

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/angelonels/Algolens.git
   cd Algolens
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the local development server**
   ```bash
   npm run dev
   ```

Then, open **http://localhost:5173** in your web browser. 🎉

---

## 🧪 Development & Quality Assurance

To ensure AlgoLens remains high quality and stable, we enforce linting, formatting, and unit tests:

### Formatting

We use **Prettier** to enforce code style. Check formatting or write fixes:

```bash
# Check formatting
npm run format:check

# Apply formatting fixes
npm run format
```

### Linting

We use **ESLint** to enforce JavaScript/TypeScript quality guidelines:

```bash
npm run lint
```

### Unit Tests

We use **Vitest** for unit tests. Run the test suite once or in watch mode:

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

### Guardrails

- **Pre-commit Hooks**: When committing changes, a pre-commit hook runs `lint-staged` to format and check your modified files.
- **Continuous Integration**: GitHub Actions runs linter, formatting checks, tests, and production build compilations on every push or pull request to the `main` branch.

---

## 🤝 Contributing

We welcome contributions! Please make sure to check out our **[Contributing Guidelines](CONTRIBUTING.md)** and read our **[Code of Conduct](CODE_OF_CONDUCT.md)** to keep our community safe and welcoming.

If you discover a security issue, please read our **[Security Policy](SECURITY.md)** for details on how to report it privately.

---

## 📄 License

This project is licensed under the terms of the **[MIT License](LICENSE)**. Feel free to copy, modify, and build upon this repository.
