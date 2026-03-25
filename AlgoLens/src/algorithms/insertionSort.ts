/**
 * Pure algorithm logic for Insertion Sort visualization.
 */

export interface InsertionSortStep {
  snapshot: number[]
  keyIndex: number
  keyValue: number | null
  phase: string
  insertedIndex: number
  comparingIndex: number
  shiftIndex?: number
  sortedCount: number
  message: string
}

export function computeInsertionSortSteps(init: number[]): InsertionSortStep[] {
  const arr = [...init]; const s: InsertionSortStep[] = []
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]; let j = i - 1
    s.push({ snapshot: [...arr], keyIndex: i, keyValue: key, phase: 'extract', insertedIndex: -1, comparingIndex: -1, sortedCount: i, message: `Extracting key: ${key} from index ${i}` })
    while (j >= 0 && arr[j] > key) {
      s.push({ snapshot: [...arr], keyIndex: i, keyValue: key, phase: 'compare', insertedIndex: -1, comparingIndex: j, shiftIndex: j + 1, sortedCount: i, message: `${arr[j]} > ${key} → shifting right` })
      arr[j + 1] = arr[j]; j--
      s.push({ snapshot: [...arr], keyIndex: i, keyValue: key, phase: 'shift', insertedIndex: -1, comparingIndex: j, sortedCount: i, message: `Shifted. Looking at position ${j >= 0 ? j : 'start'}` })
    }
    arr[j + 1] = key
    s.push({ snapshot: [...arr], keyIndex: -1, keyValue: key, phase: 'insert', insertedIndex: j + 1, comparingIndex: -1, sortedCount: i + 1, message: `Inserted ${key} at position ${j + 1}` })
  }
  s.push({ snapshot: [...arr], keyIndex: -1, keyValue: null, phase: 'done', insertedIndex: -1, comparingIndex: -1, sortedCount: arr.length, message: 'Array is sorted' })
  return s
}
