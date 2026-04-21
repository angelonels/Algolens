# AlgoLens 🔍

[![CI Status](https://github.com/angelonels/Algolens/actions/workflows/ci.yml/badge.svg)](https://github.com/angelonels/Algolens/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**See how algorithms actually work — step by step, right in your browser.**

Ever read about sorting or search algorithms and thought *"but what is it actually doing?"* AlgoLens lets you watch them run in real time with slick animations, so you can finally build that intuition.

No installs. No textbooks. Just pick an algorithm, hit play, and watch.

---

## 🎬 What Can You Visualize?

AlgoLens currently has **17 algorithm visualizers** across five categories:

### Sorting
| Algorithm | What It Shows |
|-----------|--------------|
| **Bubble Sort** | Bars swap next to each other until everything's in order |
| **Insertion Sort** | Pulls out a value and slides it into the right spot |
| **Selection Sort** | Scans for the minimum element and swaps it into place |
| **Merge Sort** | Splits the array in half, sorts each half, then merges them back |
| **Quick Sort** | Picks a pivot, partitions around it, repeat |
| **Heap Sort** | Builds a max heap, then extracts elements one by one |

### Searching & Pathfinding
| Algorithm | What It Shows |
|-----------|--------------|
| **Binary Search** | Shows pointers narrowing down on the target in a sorted list |
| **BFS (Breadth-First Search)** | Explores a grid layer by layer — great for shortest paths |
| **DFS (Depth-First Search)** | Dives deep down one path, then backtracks |
| **Dijkstra's Algorithm** | Finds the shortest path through a weighted graph |

### Math & Dynamic Programming
| Algorithm | What It Shows |
|-----------|--------------|
| **Euclidean GCD** | Finds the greatest common divisor using the modulo trick |
| **Matrix Traversal** | Walks through a matrix in row-major, column-major, and diagonal patterns |
| **Edit Distance (DP)** | Shows how to transform one string into another with minimum edits |

### Machine Learning
| Algorithm | What It Shows |
|-----------|--------------|
| **K-Means Clustering** | Groups data points into clusters, moving centroids until they settle |
| **Linear Regression** | Fits a line to data points using gradient descent |
| **Logistic Regression** | Draws a decision boundary to classify data into two groups |
| **Decision Tree** | Splits data by features to build a tree-shaped classifier |

---

## ✨ Features

- ⏩ **Speed control** — 0.5x, 1x, 2x, or 4x. You decide the pace.
- ⏸️ **Pause & resume** — Stop the animation anytime to study what's happening.
- 📊 **Step counter** — See exactly which step the algorithm is on.
- 🐍 **Python code snippets** — Each visualizer includes the algorithm's Python code with a copy button.
- 🎨 **Color-coded legend** — Every color means something. No guessing.
- 💫 **Smooth animations** — Built with Framer Motion for buttery transitions.
- 🌙 **Dark mode** — Toggle between light and dark themes.
- ⌨️ **Keyboard shortcuts** — Quick navigation without reaching for the mouse.
- 🔍 **Search & filter** — Find algorithms by name, category, or description.
- 🚫 **404 page** — Styled fallback for unmatched routes.

---

## 🛠️ Tech Stack

| Tool | What It Does |
|------|-------------|
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type-safe JavaScript |
| [Vite](https://vitejs.dev) | Dev server & bundler (super fast) |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [React Router](https://reactrouter.com) | Client-side navigation |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Google Fonts](https://fonts.google.com) | Inter + JetBrains Mono typefaces |

---

## 📁 Project Structure

```
AlgoLens/
└── src/
    ├── components/
    │   ├── Home.tsx               ← Landing page with the algorithm grid
    │   ├── Navbar.tsx              ← Top navigation bar
    │   ├── KeyboardShortcuts.tsx   ← Global keyboard shortcut handler
    │   ├── NotFound.tsx            ← 404 page
    │   ├── ScrollToTop.tsx         ← Scrolls to top on route change
    │   └── ui/
    │       └── shared.tsx          ← Reusable UI pieces (buttons, legends, etc.)
    ├── context/
    │   └── ThemeContext.tsx        ← Dark/light theme provider
    ├── visualizers/                ← One file per algorithm (17 total)
    │   ├── BubbleSort.tsx
    │   ├── SelectionSort.tsx
    │   ├── HeapSort.tsx
    │   ├── BinarySearch.tsx
    │   ├── ... and more
    │   └── DecisionTree.tsx
    ├── utils/
    │   └── animationConfig.ts      ← Spring physics, speed presets, variants
    ├── App.tsx                     ← Routes & app shell
    ├── main.tsx                    ← Entry point
    └── index.css                   ← Global styles & CSS variables
```

---

## 🚀 Getting Started

**Prerequisites:** You need [Node.js](https://nodejs.org) (v20 or later) installed.

```bash
# 1. Clone the repo
git clone https://github.com/angelonels/Algolens.git
cd Algolens

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser. That's it! 🎉

---

## 🤝 Contributing

Found a bug? Want to add a new algorithm? Pull requests are welcome! Please check our **[Contributing Guidelines](CONTRIBUTING.md)** and read our **[Code of Conduct](CODE_OF_CONDUCT.md)** first.

For reporting security vulnerabilities, please refer to our **[Security Policy](SECURITY.md)**.

---

## 📄 License

This project is open source and licensed under the **[MIT License](LICENSE)**. Feel free to use it, learn from it, and build on it.
