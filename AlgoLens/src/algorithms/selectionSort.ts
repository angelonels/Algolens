/**
 * Pure algorithm logic for Selection Sort visualization.
 */

export interface SelectionSortStep {
  array: number[]
  current: number
  scanning: number
  minIdx: number
  swapIndices: number[]
  sortedCount: number
  pass: number
  phase: 'scan' | 'swap' | 'done'
  message: string
}

export function computeSelectionSortSteps(init: number[]): SelectionSortStep[] {
  const arr = [...init]
  const s: SelectionSortStep[] = []
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    s.push({
      array: [...arr], current: i, scanning: i, minIdx: i,
      swapIndices: [], sortedCount: i, pass: i + 1, phase: 'scan',
      message: `Pass ${i + 1}: Finding minimum from index ${i}`
    })

    for (let j = i + 1; j < n; j++) {
      const isNewMin = arr[j] < arr[minIdx]
      if (isNewMin) {
        minIdx = j
      }
      s.push({
        array: [...arr], current: i, scanning: j, minIdx,
        swapIndices: [], sortedCount: i, pass: i + 1, phase: 'scan',
        message: isNewMin
          ? `${arr[j]} < ${arr[minIdx === j ? i : minIdx]} → new minimum found at index ${j}`
          : `${arr[j]} ≥ ${arr[minIdx]} → minimum unchanged`
      })
    }

    if (minIdx !== i) {
      s.push({
        array: [...arr], current: i, scanning: -1, minIdx,
        swapIndices: [i, minIdx], sortedCount: i, pass: i + 1, phase: 'swap',
        message: `Swapping ${arr[i]} ↔ ${arr[minIdx]} (placing minimum at index ${i})`
      });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      s.push({
        array: [...arr], current: i, scanning: -1, minIdx: i,
        swapIndices: [i, minIdx], sortedCount: i + 1, pass: i + 1, phase: 'swap',
        message: `Swapped — ${arr[i]} is now in position ${i}`
      })
    } else {
      s.push({
        array: [...arr], current: i, scanning: -1, minIdx: i,
        swapIndices: [], sortedCount: i + 1, pass: i + 1, phase: 'scan',
        message: `${arr[i]} is already in the correct position`
      })
    }
  }

  s.push({
    array: [...arr], current: -1, scanning: -1, minIdx: -1,
    swapIndices: [], sortedCount: n, pass: n - 1, phase: 'done',
    message: 'Array is sorted!'
  })
  return s
}
