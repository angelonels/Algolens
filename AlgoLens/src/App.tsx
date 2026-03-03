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
import QuickSort from './visualizers/QuickSort'
import EuclideanGCD from './visualizers/EuclideanGCD'
import MatrixTraversal from './visualizers/MatrixTraversal'
import DijkstraPath from './visualizers/DijkstraPath'
import BFSGrid from './visualizers/BFSGrid'
import DFSGrid from './visualizers/DFSGrid'
import KMeans from './visualizers/KMeans'
import EditDistance from './visualizers/EditDistance'
import LinearRegression from './visualizers/LinearRegression'
import LogisticRegression from './visualizers/LogisticRegression'
import DecisionTree from './visualizers/DecisionTree'

import type { ReactNode } from 'react'

function PageWrap({ children }: { children: ReactNode }) {
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

const routes = [
  { path: '/binary-search', element: <BinarySearch /> },
  { path: '/bubble-sort', element: <BubbleSort /> },
  { path: '/insertion-sort', element: <InsertionSort /> },
  { path: '/merge-sort', element: <MergeSort /> },
  { path: '/quick-sort', element: <QuickSort /> },
  { path: '/gcd', element: <EuclideanGCD /> },
  { path: '/matrix-traversal', element: <MatrixTraversal /> },
  { path: '/dijkstra', element: <DijkstraPath /> },
  { path: '/bfs', element: <BFSGrid /> },
  { path: '/dfs', element: <DFSGrid /> },
  { path: '/kmeans', element: <KMeans /> },
  { path: '/edit-distance', element: <EditDistance /> },
  { path: '/linear-regression', element: <LinearRegression /> },
  { path: '/logistic-regression', element: <LogisticRegression /> },
  { path: '/decision-tree', element: <DecisionTree /> },
]

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrap><Home /></PageWrap>} />
        {routes.map(r => (
          <Route key={r.path} path={r.path} element={<PageWrap>{r.element}</PageWrap>} />
        ))}
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
