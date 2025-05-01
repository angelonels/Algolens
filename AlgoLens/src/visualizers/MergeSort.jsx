import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'


const mergeSortPythonCode = `
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
`

export default function MergeSortVisualizer() {

  const init = [23,24,35,46,35,2,5,78,1,3,0,32,45]
  const [array] = useState(init)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [running, setRunning] = useState(false)


  const computeSteps = () => {
    const arr = [...array]
    const s = []

    const aux = arr.slice()
    const merge = (l, m, r) => {
      let i = l, j = m + 1, k = l
      while (i <= m && j <= r) {
        if (aux[i] <= aux[j]) {
          arr[k++] = aux[i++]
        } else {
          arr[k++] = aux[j++]
        }
      }
      while (i <= m) arr[k++] = aux[i++]
      while (j <= r) arr[k++] = aux[j++]

      s.push({ snapshot: arr.slice(), range: [l, r] })

      for (let x = l; x <= r; x++) aux[x] = arr[x]
    }

    const mergeSort = (l, r) => {
      if (l >= r) return
      const m = Math.floor((l + r) / 2)
      mergeSort(l, m)
      mergeSort(m + 1, r)
      merge(l, m, r)
    }

    mergeSort(0, arr.length - 1)
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
    navigator.clipboard.writeText(mergeSortPythonCode)
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
      <h3 style={{ marginBottom: 8 }}>What is Merge Sort?</h3>
      <p>
        Merge Sort is a classic divide-and-conquer sorting algorithm. It recursively splits the array into halves,
        sorts each half, and then merges the sorted halves back together. Its time complexity is O(n log n).
      </p>
      <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
      <ol style={{ paddingLeft: 20 }}>
        <li>Divide the array into two halves until each piece has one element.</li>
        <li>Recursively sort the left and right halves.</li>
        <li>Merge the two sorted halves into one sorted segment.</li>
        <li>Repeat merges up the recursion tree until the full array is merged.</li>
      </ol>
      <h4 style={{ margin: '16px 0 8px' }}>Time Complexity & Space</h4>
      <p>
        Merge Sort runs in O(n log n) time in all cases and requires O(n) extra space for merging.
      </p>
    </div>
  )

  const step = steps[currentStep] || { snapshot: array, range: [] }

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Merge Sort Visualizer</h2>
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
        <pre style={{ margin: 0 }}>{mergeSortPythonCode}</pre>
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
        >
          Copy Code
        </button>
      </div>

    
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        {step.snapshot.map((v, i) => {
          const [l, r] = step.range
          const inMerge = i >= l && i <= r
          const isFinal = !running && steps.length && currentStep === steps.length - 1

          let bg = isFinal
            ? '#8eed8e'
            : inMerge
            ? '#ffa500'
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
              animate={{ scale: inMerge || isFinal ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {v}
            </motion.div>
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

