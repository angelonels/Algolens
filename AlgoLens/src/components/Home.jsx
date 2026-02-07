import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const algorithms = [
  { name: 'Binary Search', path: '/binary-search' },
  { name: 'Bubble Sort', path: '/bubble-sort' },
  { name: 'Insertion Sort', path: '/insertion-sort' },
  { name: 'Merge Sort', path: '/merge-sort' },
  { name: 'Euclidean GCD', path: '/gcd' },
  { name: 'Matrix Traversal', path: '/matrix-traversal' },
  { name: 'Quick Sort', path: '/quick-sort' },
  { name: "Dijkstra's Path", path: '/dijkstra' }
]

export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '2rem', fontSize: '2rem' }}
      >
        Welcome to AlgoLens 👁️ — Your Algorithm Visualizer
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          padding: '1rem',
          maxWidth: '900px',
          margin: 'auto'
        }}
      >
        {algorithms.map((algo, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{
              backgroundColor: '#f1f5f9',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            <Link
              to={algo.path}
              style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 'bold' }}
            >
              {algo.name}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
