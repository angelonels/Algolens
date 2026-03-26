import { Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { PAGE_TRANSITION } from './utils/animationConfig'
import { ALGORITHMS } from './data/algorithmRegistry'
import Navbar from './components/Navbar'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import ScrollToTop from './components/ScrollToTop'
import Home from './components/Home'
import NotFound from './components/NotFound'
import { lazy } from 'react'

const ComplexityTable = lazy(() => import('./components/ComplexityTable'))

import type { ReactNode } from 'react'

function PageWrap({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={PAGE_TRANSITION.initial}
      animate={PAGE_TRANSITION.animate}
      exit={PAGE_TRANSITION.exit}
      transition={PAGE_TRANSITION.transition}
      style={{
        willChange: 'transform, opacity, filter',
      }}
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
        <Route path="/" element={<PageWrap><Home /></PageWrap>} />
        <Route path="/complexity" element={<PageWrap><Suspense fallback={null}><ComplexityTable /></Suspense></PageWrap>} />
        {ALGORITHMS.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <PageWrap>
                <Suspense fallback={null}>
                  <Component />
                </Suspense>
              </PageWrap>
            }
          />
        ))}
        <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Navbar />
      <KeyboardShortcuts />
      <AnimatedRoutes />
    </ThemeProvider>
  )
}
