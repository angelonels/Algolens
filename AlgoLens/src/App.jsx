import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { PAGE_TRANSITION } from './utils/animationConfig'
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

function PageTransition({ children }) {
  return (
    <motion.div
      initial={PAGE_TRANSITION.initial}
      animate={PAGE_TRANSITION.animate}
      exit={PAGE_TRANSITION.exit}
      transition={PAGE_TRANSITION.transition}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/binary-search" element={<PageTransition><BinarySearch /></PageTransition>} />
        <Route path="/bubble-sort" element={<PageTransition><BubbleSort /></PageTransition>} />
        <Route path="/insertion-sort" element={<PageTransition><InsertionSort /></PageTransition>} />
        <Route path="/merge-sort" element={<PageTransition><MergeSort /></PageTransition>} />
        <Route path="/gcd" element={<PageTransition><EuclideanGCD /></PageTransition>} />
        <Route path="/matrix-traversal" element={<PageTransition><MatrixTraversal /></PageTransition>} />
        <Route path="/quick-sort" element={<PageTransition><QuickSort /></PageTransition>} />
        <Route path="/dijkstra" element={<PageTransition><DijkstraPath /></PageTransition>} />
        <Route path="/bfs" element={<PageTransition><BFSGrid /></PageTransition>} />
        <Route path="/dfs" element={<PageTransition><DFSGrid /></PageTransition>} />
        <Route path="/kmeans" element={<PageTransition><KMeans /></PageTransition>} />
        <Route path="/edit-distance" element={<PageTransition><EditDistance /></PageTransition>} />
        <Route path="/linear-regression" element={<PageTransition><LinearRegression /></PageTransition>} />
        <Route path="/logistic-regression" element={<PageTransition><LogisticRegression /></PageTransition>} />
        <Route path="/decision-tree" element={<PageTransition><DecisionTree /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <KeyboardShortcuts />
      <AnimatedRoutes />
    </ThemeProvider>
  )
}
