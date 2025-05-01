import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{
      padding: '1rem',
      backgroundColor: '#1e293b',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>AlgoLens</Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/binary-search" style={{ color: 'white' }}>Binary Search</Link>
        <Link to="/bubble-sort" style={{ color: 'white' }}>Bubble Sort</Link>
        <Link to="/insertion-sort" style={{ color: 'white' }}>Insertion Sort</Link>
        <Link to="/merge-sort" style={{ color: 'white' }}>Merge Sort</Link>
        <Link to="/gcd" style={{ color: 'white' }}>GCD</Link>
        <Link to="/matrix-traversal" style={{ color: 'white' }}>Matrix</Link>
      </div>
    </nav>
  )
}
