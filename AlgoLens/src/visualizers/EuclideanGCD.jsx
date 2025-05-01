import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'


const gcdPythonCode = `
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a
`

export default function GCDVisualizer() {

  const [a, setA] = useState(252)
  const [b, setB] = useState(105)

  // Computed steps and control state
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)


  const computeSteps = () => {
    let x = a, y = b
    const s = []
    while (y !== 0) {
      s.push({ x, y, r: x % y })
      const tmp = y
      y = x % y
      x = tmp
    }
    s.push({ x, y: 0, r: null }) 
    return s
  }


  const start = () => {
    setResult(null)
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
        setResult(steps[currentStep].x)
      }
    }
  }, [running, currentStep, steps])


  const copyToClipboard = () => {
    navigator.clipboard.writeText(gcdPythonCode)
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
      <h3 style={{ marginBottom: 8 }}>What is the Euclidean GCD Algorithm?</h3>
      <p>
        The Euclidean algorithm finds the greatest common divisor (GCD) of two integers 
        <code>a</code> and <code>b</code>. It repeatedly replaces <code>(a, b)</code> 
        with <code>(b, a % b)</code> until <code>b</code> becomes zero; then <code>a</code> is the GCD.
      </p>
      <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
      <ol style={{ paddingLeft: 20 }}>
        <li>Compute <code>r = a % b</code>.</li>
        <li>Set <code>a ← b</code>, <code>b ← r</code>.</li>
        <li>Repeat until <code>b = 0</code>.</li>
        <li>When <code>b = 0</code>, <code>a</code> is the GCD.</li>
      </ol>
      <h4 style={{ margin: '16px 0 8px' }}>Time Complexity</h4>
      <p>
        Runs in O(log min(a, b)) time, which is very efficient even for large inputs.
      </p>
    </div>
  )

  const step = steps[currentStep] || {}

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Euclidean GCD Visualizer</h2>
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
        <pre style={{ margin: 0 }}>{gcdPythonCode}</pre>
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


      <div style={{ marginTop: 20, fontSize: 16 }}>
        <label style={{ marginRight: 8 }}>a:</label>
        <input
          type="number"
          value={a}
          onChange={e => setA(+e.target.value)}
          style={{ width: 80, padding: '6px 8px', marginRight: 16, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <label style={{ marginRight: 8 }}>b:</label>
        <input
          type="number"
          value={b}
          onChange={e => setB(+e.target.value)}
          style={{ width: 80, padding: '6px 8px', borderRadius: 4, border: '1px solid #ccc' }}
        />
      </div>


      <div style={{ marginTop: 30 }}>
        {steps.slice(0, currentStep + 1).map((st, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: '#e0f2fe',
              padding: '10px 20px',
              margin: '10px auto',
              borderRadius: 6,
              maxWidth: 400,
              fontSize: 16,
              textAlign: 'left',
              boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
            }}
          >
            {st.r !== null
              ? `gcd(${st.x}, ${st.y}) → gcd(${st.y}, ${st.r})`
              : `Final GCD = ${st.x}`}
          </motion.div>
        ))}
      </div>


      <div style={{ marginTop: 20 }}>
        <button
          onClick={start}
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
          {running ? 'Computing…' : 'Start'}
        </button>
      </div>

      {result !== null && (
        <p style={{ marginTop: 20, fontSize: 18 }}>
          🎉 GCD is <strong>{result}</strong>
        </p>
      )}
    </div>
  )
}

