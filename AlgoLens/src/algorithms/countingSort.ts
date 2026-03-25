/**
 * Pure algorithm logic for Counting Sort visualization.
 */

export interface CountingSortStep {
  inputArray: number[]
  countArray: number[]
  outputArray: number[]
  highlightInput: number
  highlightCount: number
  highlightOutput: number
  phase: 'count' | 'build' | 'done'
  message: string
}

export function computeCountingSortSteps(init: number[]): CountingSortStep[] {
  const arr = [...init]
  const s: CountingSortStep[] = []
  const maxVal = Math.max(...arr)
  const count = new Array(maxVal + 1).fill(0)
  const output: number[] = []

  s.push({
    inputArray: [...arr], countArray: [...count], outputArray: [],
    highlightInput: -1, highlightCount: -1, highlightOutput: -1,
    phase: 'count',
    message: `Starting Counting Sort — max value is ${maxVal}, creating count array of size ${maxVal + 1}`
  })

  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++
    s.push({
      inputArray: [...arr], countArray: [...count], outputArray: [],
      highlightInput: i, highlightCount: arr[i], highlightOutput: -1,
      phase: 'count',
      message: `Counting ${arr[i]} → count[${arr[i]}] = ${count[arr[i]]}`
    })
  }

  s.push({
    inputArray: [...arr], countArray: [...count], outputArray: [],
    highlightInput: -1, highlightCount: -1, highlightOutput: -1,
    phase: 'count',
    message: 'Counting complete — now building sorted output'
  })

  for (let i = 0; i <= maxVal; i++) {
    for (let j = 0; j < count[i]; j++) {
      output.push(i)
      s.push({
        inputArray: [...arr], countArray: [...count], outputArray: [...output],
        highlightInput: -1, highlightCount: i, highlightOutput: output.length - 1,
        phase: 'build',
        message: `Placing ${i} at output position ${output.length - 1}`
      })
    }
  }

  s.push({
    inputArray: [...arr], countArray: [...count], outputArray: [...output],
    highlightInput: -1, highlightCount: -1, highlightOutput: -1,
    phase: 'done',
    message: 'Array is sorted!'
  })
  return s
}
