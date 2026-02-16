import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
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

export default function App() {
  return (
    <>
      <Navbar />
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
      </Routes>
    </>
  )
}

