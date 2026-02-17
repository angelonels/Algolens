# AlgoLens 🔍

**See how algorithms actually work — step by step, right in your browser.**

Ever read about sorting or search algorithms and thought *"but what is it actually doing?"* AlgoLens lets you watch them run in real time with slick animations, so you can finally build that intuition.

No installs. No textbooks. Just pick an algorithm, hit play, and watch.

---

## 🎬 What Can You Visualize?

AlgoLens currently has **15 algorithm visualizers** across four categories:

### Sorting
| Algorithm | What It Shows |
|-----------|--------------|
| **Bubble Sort** | Bars swap next to each other until everything's in order |
| **Insertion Sort** | Pulls out a value and slides it into the right spot |
| **Merge Sort** | Splits the array in half, sorts each half, then merges them back |
| **Quick Sort** | Picks a pivot, partitions around it, repeat |

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
| **Matrix Traversal** | Walks through a matrix in a spiral pattern |
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

- ⏩ **Speed control** — Slow, normal, fast, or turbo. You decide the pace.
- ⏸️ **Pause & resume** — Stop the animation anytime to study what's happening.
- 📊 **Step counter** — See exactly which step the algorithm is on.
- 🐍 **Python code snippets** — Each visualizer includes the algorithm's Python code with a copy button.
- 🎨 **Color-coded legend** — Every color means something. No guessing.
- 💫 **Smooth animations** — Built with Framer Motion for buttery transitions.

---

## 🛠️ Tech Stack

| Tool | What It Does |
|------|-------------|
| [React 19](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Dev server & bundler (super fast) |
| [React Router](https://reactrouter.com) | Navigation between pages |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Google Fonts](https://fonts.google.com) | Inter + JetBrains Mono typefaces |

---

## 📁 Project Structure

```
AlgoLens/
└── src/
    ├── components/
    │   ├── Home.jsx              ← Landing page with the algorithm grid
    │   ├── Navbar.jsx             ← Top navigation bar
    │   └── ui/
    │       └── AnimationComponents.jsx  ← Reusable UI pieces (buttons, etc.)
    ├── visualizers/               ← One file per algorithm
    │   ├── BubbleSort.jsx
    │   ├── BinarySearch.jsx
    │   ├── MergeSort.jsx
    │   ├── ... (15 total)
    │   └── DecisionTree.jsx
    ├── utils/
    │   └── animationConfig.js     ← Colors, animation timings, shared styles
    ├── App.jsx                    ← Routes & app shell
    ├── main.jsx                   ← Entry point
    └── index.css                  ← Global styles & CSS variables
```

---

## 🚀 Getting Started

**Prerequisites:** You need [Node.js](https://nodejs.org) (v18 or later) installed.

```bash
# 1. Clone the repo
git clone https://github.com/your-username/AlgoLens.git
cd AlgoLens

# 2. Move into the app folder
cd AlgoLens

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser. That's it! 🎉

---

## 🤝 Contributing

Found a bug? Want to add a new algorithm? Pull requests are welcome!

1. Fork the repo
2. Create a branch (`git checkout -b my-new-algorithm`)
3. Commit your changes
4. Push and open a PR

---

## 📄 License

This project is open source. Feel free to use it, learn from it, and build on it.
