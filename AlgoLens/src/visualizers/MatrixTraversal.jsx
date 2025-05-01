import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'


const spiralPythonCode = `
def spiral_traverse(matrix):
    result = []
    if not matrix: return result
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    return result
`

export default function SpiralMatrixVisualizer() {
  const [N, setN] = useState(4)
  const [matrix, setMatrix] = useState([])
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState([])


  useEffect(() => {
    const m = Array.from({ length: N }, (_, i) =>
      Array.from({ length: N }, (_, j) => i * N + j + 1)
    )
    setMatrix(m)
    setSteps([])
    setCurrentStep(-1)
    setResult([])
    setRunning(false)
  }, [N])


  const computeSteps = () => {
    const res = []
    let top = 0, bottom = N - 1, left = 0, right = N - 1
    while (top <= bottom && left <= right) {
      for (let j = left; j <= right; j++) res.push([top, j])
      top++
      for (let i = top; i <= bottom; i++) res.push([i, right])
      right--
      if (top <= bottom) {
        for (let j = right; j >= left; j--) res.push([bottom, j])
        bottom--
      }
      if (left <= right) {
        for (let i = bottom; i >= top; i--) res.push([i, left])
        left++
      }
    }
    return res
  }

  const startTraversal = () => {
    const s = computeSteps()
    setSteps(s)
    setCurrentStep(0)
    setRunning(true)
    setResult([]) 
  }


  useEffect(() => {
    if (running && currentStep >= 0) {

      const [r, c] = steps[currentStep]
      setResult(res => [...res, matrix[r][c]])

      if (currentStep < steps.length - 1) {
        const t = setTimeout(() => setCurrentStep(cs => cs + 1), 100)
        return () => clearTimeout(t)
      } else {
        setRunning(false)
      }
    }
  }, [running, currentStep, steps, matrix])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(spiralPythonCode)
    alert('Python code copied!')
  }

  const explanation = (
    <div style={{
      maxWidth: 800,
      margin: '20px auto',
      textAlign: 'left',
      color: '#333',
      fontSize: 16,
      lineHeight: 1.6
    }}>
      <h3 style={{ marginBottom: 8 }}>What is Spiral Matrix Traversal?</h3>
      <p>
        Prints the elements of an N×N matrix in a clockwise spiral order,
        layer by layer, until every element is visited.
      </p>
      <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
      <ol style={{ paddingLeft: 20 }}>
        <li>Traverse top row left→right, increment top.</li>
        <li>Traverse right column top→bottom, decrement right.</li>
        <li>Traverse bottom row right→left, decrement bottom (if valid).</li>
        <li>Traverse left column bottom→top, increment left (if valid).</li>
        <li>Repeat until pointers cross.</li>
      </ol>
      <h4 style={{ margin: '16px 0 8px' }}>Time Complexity</h4>
      <p>O(N²), since all N×N elements are processed exactly once.</p>
    </div>
  )

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Spiral Matrix Traversal Visualizer</h2>
      {explanation}


      <div style={{
        background: '#f5f5f5',
        padding: 15,
        borderRadius: 5,
        fontFamily: 'monospace',
        textAlign: 'left',
        maxWidth: 800,
        margin: '0 auto'
      }}>
        <pre style={{ margin: 0 }}>{spiralPythonCode}</pre>
        <button
          onClick={copyToClipboard}
          style={{
            marginTop: 10,
            padding: '8px 12px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >Copy Code</button>
      </div>


      <div style={{ marginTop: 20, fontSize: 16 }}>
        <label style={{ marginRight: 8 }}>Size N:</label>
        <input
          type="number"
          min="1"
          max="20"
          value={N}
          onChange={e => setN(Math.max(1, Math.min(20, +e.target.value)))}
          style={{ width: 60, padding: '6px 8px', borderRadius: 4, border: '1px solid #ccc' }}
        />
      </div>


      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${N}, 50px)`,
        gap: '6px',
        justifyContent: 'center',
        marginTop: 20
      }}>
        {matrix.map((row, i) =>
          row.map((val, j) => {
            const isCurrent = running && steps[currentStep] &&
                              steps[currentStep][0] === i && steps[currentStep][1] === j
            const isVisited = result.includes(val)
            return (
              <motion.div
                key={`${i}-${j}`}
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: isVisited ? 1 : 0.3,
                  scale: isCurrent ? 1.2 : 1
                }}
                transition={{ duration: 0.4 }}
                style={{
                  width: 50,
                  height: 50,
                  background: isCurrent ? '#ffa500' : '#d0e7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  fontSize: 14,
                  color: '#000'
                }}
              >
                {val}
              </motion.div>
            )
          })
        )}
      </div>


      <div style={{ marginTop: 20 }}>
        <button
          onClick={startTraversal}
          disabled={running}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: running ? 'not-allowed' : 'pointer'
          }}
        >
          {running ? 'Traversing…' : 'Start Traversal'}
        </button>
      </div>


      {result.length === N * N && (
        <div style={{
          marginTop: 20,
          textAlign: 'left',
          display: 'inline-block',
          maxWidth: 800,
          fontSize: 16,
          color: '#333'
        }}>
          <h4>Traversal Result:</h4>
          <p>{result.join(', ')}</p>
        </div>
      )}
    </div>
  )
}


