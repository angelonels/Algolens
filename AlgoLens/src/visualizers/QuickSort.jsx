import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'


const quickSortPythonCode = `
def quick_sort(arr, low, high):
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
`

export default function QuickSortVisualizer() {

    const init = [8, 3, 7, 1, 5, 9, 2, 6, 4]
    const [array] = useState(init)
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [searching, setSearching] = useState(false)


    const computeSteps = () => {
        const arr = [...array]
        const s = []

        const partition = (low, high) => {
            const pivot = arr[high]
            let i = low - 1

            for (let j = low; j < high; j++) {
                s.push({
                    array: [...arr],
                    pivot: high,
                    compare: [j],
                    swap: false,
                    range: [low, high]
                })

                if (arr[j] <= pivot) {
                    i++
                    if (i !== j) {
                        [arr[i], arr[j]] = [arr[j], arr[i]]
                        s.push({
                            array: [...arr],
                            pivot: high,
                            compare: [i, j],
                            swap: true,
                            range: [low, high]
                        })
                    }
                }
            }

            if (i + 1 !== high) {
                [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
                s.push({
                    array: [...arr],
                    pivot: i + 1,
                    compare: [i + 1, high],
                    swap: true,
                    range: [low, high]
                })
            }

            return i + 1
        }

        const quickSort = (low, high) => {
            if (low < high) {
                const pivotIndex = partition(low, high)
                quickSort(low, pivotIndex - 1)
                quickSort(pivotIndex + 1, high)
            }
        }

        quickSort(0, arr.length - 1)
        s.push({ array: [...arr], pivot: -1, compare: [], swap: false, range: [], done: true })
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
            }, 800)
            return () => clearTimeout(t)
        } else if (searching && currentStep === steps.length - 1) {
            setSearching(false)
        }
    }, [currentStep, searching, steps])


    const copyToClipboard = () => {
        navigator.clipboard.writeText(quickSortPythonCode)
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
            <h3 style={{ marginBottom: 8 }}>What is Quick Sort?</h3>
            <p>
                Quick Sort is an efficient, divide-and-conquer sorting algorithm. It works by selecting a "pivot" element
                and partitioning the array so that all elements smaller than the pivot come before it, and all elements
                greater come after it. The sub-arrays are then recursively sorted.
            </p>
            <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
            <ol style={{ paddingLeft: 20 }}>
                <li>Choose a pivot element (commonly the last element).</li>
                <li>Partition the array: elements ≤ pivot go left, elements &gt; pivot go right.</li>
                <li>Place the pivot in its correct sorted position.</li>
                <li>Recursively apply the same process to the left and right sub-arrays.</li>
                <li>Base case: sub-arrays with 0 or 1 element are already sorted.</li>
            </ol>
            <h4 style={{ margin: '16px 0 8px' }}>Time Complexity</h4>
            <p>
                Average case: <strong>O(n log n)</strong>. Worst case (already sorted): <strong>O(n²)</strong>.
                Space complexity: <strong>O(log n)</strong> due to recursion stack.
            </p>
        </div>
    )

    const step = steps[currentStep] || { array, pivot: -1, compare: [], swap: false, range: [], done: false }

    return (
        <div style={{ textAlign: 'center', padding: 20 }}>
            <h2>Quick Sort Visualizer</h2>
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
                <pre style={{ margin: 0 }}>{quickSortPythonCode}</pre>
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

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                {step.array.map((v, i) => {
                    const isPivot = i === step.pivot
                    const isCompare = step.compare.includes(i)
                    const inRange = step.range && step.range.length === 2 && i >= step.range[0] && i <= step.range[1]
                    const isDone = step.done

                    let bg = '#d0e7ff' // default
                    if (isDone) {
                        bg = '#8eed8e' // sorted green
                    } else if (isPivot) {
                        bg = '#a78bfa' // pivot purple
                    } else if (isCompare && step.swap) {
                        bg = '#ff7070' // swap red
                    } else if (isCompare) {
                        bg = '#ffd580' // compare orange
                    } else if (inRange) {
                        bg = '#bae6fd' // in partition range light blue
                    }

                    return (
                        <motion.div
                            key={i}
                            style={{
                                width: 40,
                                height: 80,
                                margin: '4px',
                                background: bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                                borderRadius: 4,
                                color: '#000',
                                border: isPivot ? '3px solid #7c3aed' : 'none'
                            }}
                            animate={{ scale: isCompare || isPivot ? 1.15 : 1 }}
                            transition={{ duration: 0.3 }}
                        >{v}</motion.div>
                    )
                })}
            </div>

            <div style={{ marginTop: 15, fontSize: 14, color: '#666' }}>
                <span style={{ marginRight: 15 }}>
                    <span style={{ display: 'inline-block', width: 12, height: 12, background: '#a78bfa', borderRadius: 2, marginRight: 5 }}></span>
                    Pivot
                </span>
                <span style={{ marginRight: 15 }}>
                    <span style={{ display: 'inline-block', width: 12, height: 12, background: '#ffd580', borderRadius: 2, marginRight: 5 }}></span>
                    Comparing
                </span>
                <span style={{ marginRight: 15 }}>
                    <span style={{ display: 'inline-block', width: 12, height: 12, background: '#ff7070', borderRadius: 2, marginRight: 5 }}></span>
                    Swapping
                </span>
                <span>
                    <span style={{ display: 'inline-block', width: 12, height: 12, background: '#8eed8e', borderRadius: 2, marginRight: 5 }}></span>
                    Sorted
                </span>
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
