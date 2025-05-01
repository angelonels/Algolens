import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'


const insertionSortPythonCode = `
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
`

export default function InsertionSortVisualizer() {

  const init = [7, 2, 5, 3, 9, 1, 6]
  const [array] = useState(init)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [running, setRunning] = useState(false)


  const computeSteps = () => {
    const arr = [...array]
    const s = []
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i]
      let j = i - 1

      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j]
        j--
      }
      arr[j + 1] = key
      s.push({ snapshot: [...arr], insertedIndex: j + 1, sortedCount: i + 1 })
    }
    return s
  }


  const startSort = () => {
    const s = computeSteps()
    setSteps(s)
    setCurrentStep(0)
    setRunning(true)
  }


  useEffect(() => {
    if (running && currentStep >= 0) {
      if (currentStep < steps.length - 1) {
        const t = setTimeout(() => setCurrentStep(cs => cs + 1), 1000)
        return () => clearTimeout(t)
      } else {
        setRunning(false)
      }
    }
  }, [currentStep, running, steps])


  const copyToClipboard = () => {
    navigator.clipboard.writeText(insertionSortPythonCode)
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
      <h3 style={{ marginBottom: 8 }}>What is Insertion Sort?</h3>
      <p>
        Insertion Sort builds a sorted array one element at a time. At each pass, it takes the next 
        element <code>key</code> and inserts it into its correct position among the previously sorted elements.
      </p>
      <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
      <ol style={{ paddingLeft: 20 }}>
        <li>Start with the second element (<code>i=1</code>), treat the first element as sorted.</li>
        <li>“Extract” the element at index <code>i</code> as <code>key</code>.</li>
        <li>Shift all larger sorted elements rightward to make room.</li>
        <li>Insert <code>key</code> into its correct spot.</li>
        <li>Repeat for each element until the array is fully sorted.</li>
      </ol>
      <h4 style={{ margin: '16px 0 8px' }}>Time Complexity</h4>
      <p>
        Worst/Average case: <strong>O(n²)</strong>, Best case (already sorted): <strong>O(n)</strong>.
      </p>
    </div>
  )

  const step = steps[currentStep] || { snapshot: array, insertedIndex: -1, sortedCount: 0 }

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Insertion Sort Visualizer</h2>
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
        <pre style={{ margin: 0 }}>{insertionSortPythonCode}</pre>
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
        {step.snapshot.map((v, i) => {
          const isInserted = i === step.insertedIndex
          const isSorted   = i < step.sortedCount
          const bg = isInserted
            ? '#ffa500'
            : isSorted
            ? '#8eed8e'
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
              animate={{ scale: isInserted ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            >{v}</motion.div>
          )
        })}
      </div>


      <div style={{ marginTop: 20 }}>
        <button
          onClick={startSort}
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
          {running ? 'Sorting…' : 'Start Sort'}
        </button>
      </div>
    </div>
  )
}
