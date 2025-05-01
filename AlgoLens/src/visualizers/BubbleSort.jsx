import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'


const bubbleSortPythonCode = `
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
`

export default function BubbleSortVisualizer() {

  const init = [5, 1, 4, 2, 8, 3, 7]
  const [array] = useState(init)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [searching, setSearching] = useState(false)


  const computeSteps = () => {
    const arr = [...array]
    const s = []
    const n = arr.length
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const isSwap = arr[j] > arr[j + 1]
        s.push({
          array: [...arr],
          compare: [j, j + 1],
          swap: isSwap,
          sortedCount: i
        })
        if (isSwap) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
      }
    }

    s.push({ array: [...arr], compare: [], swap: false, sortedCount: n })
    return s
  }


  const startSort = () => {
    const s = computeSteps()
    setSteps(s)
    setCurrentStep(0)
    setSearching(true)
  }


  useEffect(() => {
    if (searching && currentStep >= 0 && currentStep < steps.length - 1) {
      const t = setTimeout(() => {
        setCurrentStep(cs => cs + 1)
      }, 1000)
      return () => clearTimeout(t)
    } else if (searching && currentStep === steps.length - 1) {
      setSearching(false)
    }
  }, [currentStep, searching, steps])


  const copyToClipboard = () => {
    navigator.clipboard.writeText(bubbleSortPythonCode)
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
      <h3 style={{ marginBottom: 8 }}>What is Bubble Sort?</h3>
      <p>
        Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent pairs, 
        and swaps them if they are in the wrong order. Each pass “bubbles” the largest unsorted element to its correct position 
        at the end of the array.
      </p>
      <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
      <ol style={{ paddingLeft: 20 }}>
        <li>Start at the beginning of the array.</li>
        <li>Compare each pair of adjacent elements <code>(j, j+1)</code>.</li>
        <li>If <code>arr[j] &gt; arr[j+1]</code>, swap them.</li>
        <li>Continue to the end; the largest element moves to its final slot.</li>
        <li>Repeat for the unsorted portion (<code>n–i–1</code> elements) until the entire array is sorted.</li>
      </ol>
      <h4 style={{ margin: '16px 0 8px' }}>Time Complexity</h4>
      <p>
        Worst and average case: <strong>O(n²)</strong>. Best case (already sorted): <strong>O(n)</strong> with a small optimization.
      </p>
    </div>
  )

  const step = steps[currentStep] || { array, compare: [], swap: false, sortedCount: 0 }

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Bubble Sort Visualizer</h2>
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
        <pre style={{ margin: 0 }}>{bubbleSortPythonCode}</pre>
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

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        {step.array.map((v, i) => {
          const isCompare = step.compare.includes(i)
          const isSorted = i >= step.array.length - step.sortedCount
          const bg = isSorted
            ? '#8eed8e'
            : isCompare
            ? (step.swap ? '#ff7070' : '#ffd580')
            : '#d0e7ff'

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
              animate={{ scale: isCompare ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            >{v}</motion.div>
          )
        })}
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={startSort}
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
          {searching ? 'Sorting…' : 'Start Sort'}
        </button>
      </div>
    </div>
  )
}
