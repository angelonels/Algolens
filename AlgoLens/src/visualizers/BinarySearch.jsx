import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'


const binarySearchPythonCode = `
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
`

export default function BinarySearchVisualizer() {

  const [array] = useState(Array.from({ length: 64 }, (_, i) => i + 1))
  const [target, setTarget] = useState(39)      
  const [steps, setSteps] = useState([])        
  const [currentStep, setCurrentStep] = useState(-1)
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState(null)


  const computeSteps = () => {
    let low = 0, high = array.length - 1
    const s = []
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      s.push({ low, mid, high })
      if (array[mid] === target) break
      array[mid] < target ? (low = mid + 1) : (high = mid - 1)
    }
    return s
  }


  const startSearch = () => {
    setResult(null)
    const s = computeSteps()
    setSteps(s)
    setCurrentStep(0)
    setSearching(true)
  }


  useEffect(() => {
    if (searching && currentStep >= 0) {
      if (currentStep < steps.length - 1) {
        const t = setTimeout(() => setCurrentStep(cs => cs + 1), 1000)
        return () => clearTimeout(t)
      } else {

        setSearching(false)
        setResult(steps[currentStep].mid)
      }
    }
  }, [currentStep, searching, steps])


  const onChangeTarget = e => {
    const val = Number(e.target.value)
    setTarget(val)
    setSteps([])
    setCurrentStep(-1)
    setResult(null)
    setSearching(false)
  }


  const copyToClipboard = () => {
    navigator.clipboard.writeText(binarySearchPythonCode)
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
      <h3 style={{ marginBottom: 8 }}>What is Binary Search?</h3>
      <p>
        Binary Search efficiently locates a target value within a <strong>sorted array</strong>. 
        By comparing the target to the middle element, it halves the search space on each step,
        achieving a time complexity of <strong>O(log n)</strong>.
      </p>
      <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
      <ol style={{ paddingLeft: 20 }}>
        <li>Compute <code>mid</code> = (low + high) // 2.</li>
        <li>If <code>arr[mid] === target</code>, we’re done.</li>
        <li>If <code>arr[mid] &lt; target</code>, search right half (<code>low = mid+1</code>).</li>
        <li>Otherwise, search left half (<code>high = mid-1</code>).</li>
        <li>Repeat until found or <code>low &gt; high</code>.</li>
      </ol>
      <h4 style={{ margin: '16px 0 8px' }}>Why It’s Efficient</h4>
      <p>
        Each comparison cuts the search space in half. For <code>n</code> elements, 
        you need at most <code>log₂ n</code> steps (here, log₂ 64 = 6).
      </p>
      <h4 style={{ margin: '16px 0 8px' }}>Edge Cases</h4>
      <ul style={{ paddingLeft: 20 }}>
        <li>Empty array → target not found.</li>
        <li>Single-element arrays.</li>
        <li>Target not in array → returns -1.</li>
      </ul>
    </div>
  )

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Binary Search Visualizer</h2>
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
        <pre style={{ margin: 0 }}>{binarySearchPythonCode}</pre>
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


      <div style={{ marginTop: 20 }}>
        <label style={{ marginRight: 8, fontSize: 16 }}>Target:</label>
        <input
          type="number"
          value={target}
          onChange={onChangeTarget}
          style={{
            width: 80,
            padding: '6px 8px',
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #ccc'
          }}
        />
      </div>


      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        {array.map((v, i) => {
          const step = steps[currentStep] || {}
          const inRange = i >= step.low && i <= step.high
          const isMid   = i === step.mid
          const isFound = result === i

          let bg = '#d0e7ff'
          if (isFound)       bg = '#8eed8e'
          else if (isMid)    bg = inRange ? '#ffa500' : '#d0e7ff'
          else if (inRange)  bg = '#ffd580'

          return (
            <motion.div
              key={i}
              style={{
                width: 40,
                height: 80,
                margin: '0 4px',
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                borderRadius: 4,
                color: '#000'
              }}
              animate={{ scale: isMid || isFound ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            >{v}</motion.div>
          )
        })}
      </div>


      <div style={{ marginTop: 20 }}>
        <button
          onClick={startSearch}
          disabled={searching}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: searching ? 'not-allowed' : 'pointer'
          }}
        >
          {searching ? 'Searching…' : 'Start Search'}
        </button>
      </div>

      {result !== null && (
        <p style={{ marginTop: 20 }}>
          🎉 Target <strong>{target}</strong> found at index <strong>{result}</strong>
        </p>
      )}
    </div>
  )
}




