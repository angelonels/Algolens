import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import Home from './components/Home'

import BinarySearch from './visualizers/BinarySearch'
import BubbleSort from './visualizers/BubbleSort'
import InsertionSort from './visualizers/InsertionSort'
import MergeSort from './visualizers/MergeSort'
import EuclideanGCD from './visualizers/EuclideanGCD'
import MatrixTraversal from './visualizers/MatrixTraversal'
import QuickSort from './visualizers/QuickSort'
import DijkstraPath from './visualizers/DijkstraPath'
import BFSGrid from './visualizers/BFSGrid'
import DFSGrid from './visualizers/DFSGrid'
import KMeans from './visualizers/KMeans'
import EditDistance from './visualizers/EditDistance'
import LinearRegression from './visualizers/LinearRegression'
import LogisticRegression from './visualizers/LogisticRegression'
import DecisionTree from './visualizers/DecisionTree'

export default function App() {
  return (
    <>
      <Navbar />
      <KeyboardShortcuts />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/binary-search" element={<BinarySearch />} />
        <Route path="/bubble-sort" element={<BubbleSort />} />
        <Route path="/insertion-sort" element={<InsertionSort />} />
        <Route path="/merge-sort" element={<MergeSort />} />
        <Route path="/gcd" element={<EuclideanGCD />} />
        <Route path="/matrix-traversal" element={<MatrixTraversal />} />
        <Route path="/quick-sort" element={<QuickSort />} />
        <Route path="/dijkstra" element={<DijkstraPath />} />
        <Route path="/bfs" element={<BFSGrid />} />
        <Route path="/dfs" element={<DFSGrid />} />
        <Route path="/kmeans" element={<KMeans />} />
        <Route path="/edit-distance" element={<EditDistance />} />
        <Route path="/linear-regression" element={<LinearRegression />} />
        <Route path="/logistic-regression" element={<LogisticRegression />} />
        <Route path="/decision-tree" element={<DecisionTree />} />
      </Routes>
    </>
  )
}

