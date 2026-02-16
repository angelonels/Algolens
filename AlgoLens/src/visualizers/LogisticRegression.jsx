import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, COLORS, SPRING } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer, ControlsRow,
    SplitLayout, SplitLeft, SplitRight
} from '../components/ui/AnimationComponents'

const logregPythonCode = `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def logistic_regression(X, y, lr=0.1, epochs=100):
    w, b = 0.0, 0.0
    n = len(X)
    history = []
    
    for epoch in range(epochs):
        z = w * X + b
        y_pred = sigmoid(z)
        # Binary cross-entropy loss
        cost = -(1/n) * np.sum(
            y * np.log(y_pred + 1e-8) +
            (1 - y) * np.log(1 - y_pred + 1e-8))
        dw = (1/n) * np.sum((y_pred - y) * X)
        db = (1/n) * np.sum(y_pred - y)
        w -= lr * dw
        b -= lr * db
        history.append((w, b, cost))
    
    return w, b, history`

const CLASS_COLORS = { 0: '#2563eb', 1: '#e63312' }
const W = 460, H = 300, PAD = 40
const SIG_W = 460, SIG_H = 140

// ── Data Generation ──
function generateData(n = 40) {
    const points = []
    const sep = 2.5 + Math.random() * 1.5
    for (let i = 0; i < n; i++) {
        const label = i < n / 2 ? 0 : 1
        const center = label === 0 ? -sep / 2 : sep / 2
        const x = center + (Math.random() - 0.5) * 3
        const y = (Math.random() - 0.5) * 3
        points.push({ x, y, label })
    }
    return points.sort(() => Math.random() - 0.5)
}

function sigmoid(z) {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))))
}

// ── Gradient Descent Steps ──
function computeLogRegSteps(points, lr = 0.3, maxEpochs = 50) {
    let w = 0, b = 0
    const n = points.length
    const steps = []

    steps.push({
        w, b,
        cost: -points.reduce((s, p) => {
            const pred = sigmoid(w * p.x + b)
            return s + p.label * Math.log(pred + 1e-8) + (1 - p.label) * Math.log(1 - pred + 1e-8)
        }, 0) / n,
        epoch: 0,
        accuracy: 0,
        phase: 'init',
        message: 'Initial state: w=0, b=0 — random guessing'
    })

    for (let epoch = 1; epoch <= maxEpochs; epoch++) {
        let dw = 0, db = 0
        points.forEach(p => {
            const pred = sigmoid(w * p.x + b)
            dw += (pred - p.label) * p.x
            db += (pred - p.label)
        })
        dw /= n
        db /= n

        w -= lr * dw
        b -= lr * db

        const cost = -points.reduce((s, p) => {
            const pred = sigmoid(w * p.x + b)
            return s + p.label * Math.log(pred + 1e-8) + (1 - p.label) * Math.log(1 - pred + 1e-8)
        }, 0) / n

        const accuracy = points.filter(p => {
            const pred = sigmoid(w * p.x + b) >= 0.5 ? 1 : 0
            return pred === p.label
        }).length / n

        const converged = Math.abs(dw) < 0.005 && Math.abs(db) < 0.005

        steps.push({
            w, b, cost, epoch, accuracy,
            phase: converged ? 'converged' : 'training',
            message: converged
                ? `✓ Converged at epoch ${epoch}: accuracy=${(accuracy * 100).toFixed(1)}%`
                : `Epoch ${epoch}: w=${w.toFixed(3)}, b=${b.toFixed(3)}, accuracy=${(accuracy * 100).toFixed(1)}%`
        })

        if (converged) break
    }

    if (steps[steps.length - 1].phase !== 'converged') {
        const last = steps[steps.length - 1]
        last.phase = 'converged'
        last.message = `✓ Training complete: accuracy=${(last.accuracy * 100).toFixed(1)}%, decision boundary at x=${(-last.b / last.w).toFixed(2)}`
    }

    return steps
}

export default function LogisticRegressionVisualizer() {
    const [points, setPoints] = useState(() => generateData())
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState(SPEED_PRESETS.normal)
    const [isPaused, setIsPaused] = useState(false)
    const canvasRef = useRef(null)
    const sigCanvasRef = useRef(null)

    const xMin = Math.min(...points.map(p => p.x)) - 1
    const xMax = Math.max(...points.map(p => p.x)) + 1
    const yMin = Math.min(...points.map(p => p.y)) - 1
    const yMax = Math.max(...points.map(p => p.y)) + 1

    const toX = x => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD)
    const toY = y => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD)

    const startGD = () => {
        const s = computeLogRegSteps(points)
        setSteps(s)
        setCurrentStep(0)
        setRunning(true)
        setIsPaused(false)
    }

    const reset = () => { setSteps([]); setCurrentStep(-1); setRunning(false); setIsPaused(false) }
    const regenerate = () => { reset(); setPoints(generateData()) }
    const togglePause = () => setIsPaused(!isPaused)

    useEffect(() => {
        if (running && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const t = setTimeout(() => setCurrentStep(cs => cs + 1), speed)
            return () => clearTimeout(t)
        } else if (running && currentStep >= steps.length - 1) {
            setRunning(false)
        }
    }, [running, currentStep, steps, speed, isPaused])

    const step = steps[currentStep] || { w: 0, b: 0, cost: 0, epoch: 0, accuracy: 0, phase: 'idle', message: '' }

    // ── Main scatter plot with decision boundary ──
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        canvas.width = W * dpr; canvas.height = H * dpr
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, W, H)

        // Background
        ctx.fillStyle = '#fafaf8'
        ctx.fillRect(0, 0, W, H)

        // Decision regions (shading)
        if (currentStep >= 0 && step.w !== 0) {
            const boundary = -step.b / step.w
            const bx = toX(boundary)

            // Left region (class 0)
            const leftGrad = ctx.createLinearGradient(
                Math.max(PAD, bx - 80), 0,
                Math.min(W - PAD, bx), 0
            )
            leftGrad.addColorStop(0, 'rgba(37, 99, 235, 0.06)')
            leftGrad.addColorStop(1, 'rgba(37, 99, 235, 0.15)')
            ctx.fillStyle = leftGrad
            ctx.fillRect(PAD, PAD, Math.max(0, bx - PAD), H - 2 * PAD)

            // Right region (class 1)
            const rightGrad = ctx.createLinearGradient(
                Math.max(PAD, bx), 0,
                Math.min(W - PAD, bx + 80), 0
            )
            rightGrad.addColorStop(0, 'rgba(230, 51, 18, 0.15)')
            rightGrad.addColorStop(1, 'rgba(230, 51, 18, 0.06)')
            ctx.fillStyle = rightGrad
            ctx.fillRect(Math.max(PAD, bx), PAD, W - PAD - Math.max(PAD, bx), H - 2 * PAD)
        }

        // Grid
        ctx.strokeStyle = '#e8e4dc'
        ctx.lineWidth = 0.5
        for (let i = 0; i <= 5; i++) {
            const gx = PAD + (i / 5) * (W - 2 * PAD)
            ctx.beginPath(); ctx.moveTo(gx, PAD); ctx.lineTo(gx, H - PAD); ctx.stroke()
            const gy = PAD + (i / 5) * (H - 2 * PAD)
            ctx.beginPath(); ctx.moveTo(PAD, gy); ctx.lineTo(W - PAD, gy); ctx.stroke()
        }

        // Axes
        ctx.strokeStyle = '#0a0a0a'; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(PAD, H - PAD); ctx.lineTo(W - PAD, H - PAD); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(PAD, PAD); ctx.lineTo(PAD, H - PAD); ctx.stroke()

        // Decision boundary line
        if (currentStep >= 0 && step.w !== 0) {
            const boundary = -step.b / step.w
            const bx = toX(boundary)

            // Glow
            ctx.strokeStyle = 'rgba(10, 10, 10, 0.1)'
            ctx.lineWidth = 6
            ctx.setLineDash([])
            ctx.beginPath(); ctx.moveTo(bx, PAD); ctx.lineTo(bx, H - PAD); ctx.stroke()

            // Main line
            ctx.strokeStyle = '#0a0a0a'
            ctx.lineWidth = 2
            ctx.setLineDash([6, 4])
            ctx.beginPath(); ctx.moveTo(bx, PAD); ctx.lineTo(bx, H - PAD); ctx.stroke()
            ctx.setLineDash([])

            // Label
            ctx.fillStyle = '#0a0a0a'
            ctx.font = 'bold 10px JetBrains Mono'
            ctx.textAlign = 'center'
            ctx.fillText(`x=${boundary.toFixed(2)}`, bx, PAD - 6)
        }

        // Data points
        points.forEach(p => {
            const px = toX(p.x), py = toY(p.y)
            const color = CLASS_COLORS[p.label]

            // Prediction correctness ring
            if (currentStep >= 0) {
                const predicted = sigmoid(step.w * p.x + step.b) >= 0.5 ? 1 : 0
                if (predicted !== p.label) {
                    ctx.strokeStyle = 'rgba(200, 0, 0, 0.4)'
                    ctx.lineWidth = 2
                    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.stroke()
                }
            }

            // Glow
            const glow = ctx.createRadialGradient(px, py, 0, px, py, 14)
            glow.addColorStop(0, p.label === 0 ? 'rgba(37,99,235,0.2)' : 'rgba(230,51,18,0.2)')
            glow.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = glow
            ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill()

            // Point
            ctx.fillStyle = color
            if (p.label === 0) {
                ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill()
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5
                ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.stroke()
            } else {
                // Diamond for class 1
                ctx.beginPath()
                ctx.moveTo(px, py - 6); ctx.lineTo(px + 6, py)
                ctx.lineTo(px, py + 6); ctx.lineTo(px - 6, py); ctx.closePath()
                ctx.fill()
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.moveTo(px, py - 6); ctx.lineTo(px + 6, py)
                ctx.lineTo(px, py + 6); ctx.lineTo(px - 6, py); ctx.closePath()
                ctx.stroke()
            }
        })
    }, [currentStep, points, step])

    // ── Sigmoid function plot ──
    useEffect(() => {
        const canvas = sigCanvasRef.current
        if (!canvas || currentStep < 0) return
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        canvas.width = SIG_W * dpr; canvas.height = SIG_H * dpr
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, SIG_W, SIG_H)

        ctx.fillStyle = '#fafaf8'
        ctx.fillRect(0, 0, SIG_W, SIG_H)

        const sPad = 30
        const plotW = SIG_W - 2 * sPad
        const plotH = SIG_H - 40

        // Label
        ctx.fillStyle = '#666'
        ctx.font = 'bold 9px JetBrains Mono'
        ctx.textAlign = 'left'
        ctx.fillText('SIGMOID: σ(wx + b)', sPad, 14)

        // 0.5 threshold line
        ctx.strokeStyle = '#d4d0c8'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        const halfY = 22 + plotH * 0.5
        ctx.beginPath(); ctx.moveTo(sPad, halfY); ctx.lineTo(SIG_W - sPad, halfY); ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = '#999'
        ctx.font = '9px JetBrains Mono'
        ctx.textAlign = 'right'
        ctx.fillText('0.5', sPad - 4, halfY + 3)
        ctx.fillText('1.0', sPad - 4, 26)
        ctx.fillText('0.0', sPad - 4, 22 + plotH + 4)

        // Sigmoid curve
        ctx.beginPath()
        const xRange = 8
        for (let px = 0; px <= plotW; px++) {
            const xVal = (px / plotW - 0.5) * xRange
            const z = step.w * xVal + step.b
            const sig = sigmoid(z)
            const sx = sPad + px
            const sy = 22 + plotH * (1 - sig)
            if (px === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
        }

        // Gradient fill
        const path = new Path2D()
        for (let px = 0; px <= plotW; px++) {
            const xVal = (px / plotW - 0.5) * xRange
            const z = step.w * xVal + step.b
            const sig = sigmoid(z)
            const sx = sPad + px
            const sy = 22 + plotH * (1 - sig)
            if (px === 0) path.moveTo(sx, sy)
            else path.lineTo(sx, sy)
        }
        path.lineTo(sPad + plotW, 22 + plotH)
        path.lineTo(sPad, 22 + plotH)
        path.closePath()
        const grad = ctx.createLinearGradient(0, 22, 0, 22 + plotH)
        grad.addColorStop(0, 'rgba(230, 51, 18, 0.12)')
        grad.addColorStop(1, 'rgba(230, 51, 18, 0.01)')
        ctx.fillStyle = grad
        ctx.fill(path)

        // Main curve
        ctx.strokeStyle = '#e63312'
        ctx.lineWidth = 2.5
        ctx.stroke()

        // Decision boundary marker
        if (step.w !== 0) {
            const boundary = -step.b / step.w
            const bpx = sPad + ((boundary / xRange + 0.5)) * plotW
            if (bpx > sPad && bpx < SIG_W - sPad) {
                ctx.fillStyle = '#0a0a0a'
                ctx.beginPath(); ctx.arc(bpx, halfY, 4, 0, Math.PI * 2); ctx.fill()
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5
                ctx.beginPath(); ctx.arc(bpx, halfY, 4, 0, Math.PI * 2); ctx.stroke()
            }
        }
    }, [currentStep, step])

    const isFinalStep = currentStep === steps.length - 1 && !running

    return (
        <PageContainer title="Logistic Regression">
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Logistic Regression?</h3>
                        <p>
                            Logistic Regression is a fundamental <strong>classification</strong> algorithm that
                            predicts the probability of a data point belonging to one of two classes. Despite its
                            name, it's used for <strong>classification, not regression</strong> — it outputs
                            probabilities by applying the <strong>sigmoid function</strong> to a linear combination
                            of features.
                        </p>
                        <p style={{ marginTop: 8 }}>
                            This visualization shows 1D binary classification: given a feature x, the model learns a
                            <strong> decision boundary</strong> that separates Class 0 (●) from Class 1 (◆).
                            Watch the sigmoid curve steepen and shift as gradient descent optimizes the
                            <strong> binary cross-entropy</strong> loss function.
                        </p>
                        <h4 style={{ margin: '16px 0 8px' }}>The Sigmoid Function</h4>
                        <p>
                            σ(z) = 1 / (1 + e<sup>−z</sup>) maps any real number to the range (0, 1),
                            making it perfect for modeling probabilities. The decision boundary is at
                            σ(z) = 0.5, which occurs when z = wx + b = 0, i.e., x = −b/w.
                        </p>
                        <h4 style={{ margin: '16px 0 8px' }}>How It Learns</h4>
                        <ol style={{ paddingLeft: 20, margin: 0 }}>
                            <li>Initialize weights w and bias b to zero</li>
                            <li>Compute ŷ = σ(wx + b) for each point</li>
                            <li>Calculate binary cross-entropy: −[y·log(ŷ) + (1−y)·log(1−ŷ)]</li>
                            <li>Compute gradients ∂L/∂w and ∂L/∂b</li>
                            <li>Update: w ← w − α·∂L/∂w, b ← b − α·∂L/∂b</li>
                            <li>Repeat until convergence</li>
                        </ol>
                        <h4 style={{ margin: '16px 0 8px' }}>Key Characteristics</h4>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li><strong>Linear decision boundary:</strong> Separates classes with a hyperplane</li>
                            <li><strong>Probabilistic:</strong> Outputs calibrated probabilities, not just class labels</li>
                            <li><strong>Convex loss:</strong> Binary cross-entropy is convex → guaranteed global minimum</li>
                            <li><strong>Interpretable:</strong> Weights directly indicate feature importance</li>
                        </ul>
                        <p style={{ marginTop: 12 }}>
                            <strong>Time Complexity:</strong> O(n · epochs · features)
                        </p>
                        <p style={{ marginTop: 4 }}>
                            <strong>Space Complexity:</strong> O(features) for model parameters
                        </p>
                        <p style={{ marginTop: 12, color: COLORS.fgMuted, fontSize: '0.9em' }}>
                            <strong>Real-world uses:</strong> Spam detection, medical diagnosis (disease/no disease),
                            credit scoring, churn prediction, and as the output layer of neural networks.
                        </p>
                    </ExplanationBox>

                    <CodeBlock code={logregPythonCode} onCopy={() => { }} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {/* Status Message */}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={step.phase === 'converged' ? 'success' : 'info'}
                                />
                            )}
                        </AnimatePresence>

                        {/* Main scatter plot */}
                        <div style={{
                            margin: '12px auto', border: `1px solid ${COLORS.border}`,
                            borderRadius: '2px', overflow: 'hidden', width: W
                        }}>
                            <canvas ref={canvasRef} style={{ width: W, height: H, display: 'block' }} />
                        </div>

                        {/* Stats bar */}
                        {currentStep >= 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'flex', gap: 10, justifyContent: 'center',
                                    flexWrap: 'wrap', margin: '8px 0'
                                }}
                            >
                                {[
                                    { label: 'EPOCH', val: step.epoch },
                                    { label: 'WEIGHT', val: step.w.toFixed(3) },
                                    { label: 'BIAS', val: step.b.toFixed(3) },
                                    { label: 'COST', val: step.cost.toFixed(4) },
                                    { label: 'ACC', val: `${(step.accuracy * 100).toFixed(1)}%` }
                                ].map(({ label, val }) => (
                                    <div key={label} style={{
                                        padding: '4px 8px', background: COLORS.surface,
                                        border: `1px solid ${COLORS.border}`,
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: 10, fontWeight: 600,
                                        textTransform: 'uppercase', letterSpacing: '0.04em',
                                        color: COLORS.fgMuted
                                    }}>
                                        <span style={{ color: COLORS.fg }}>{val}</span> {label}
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Sigmoid plot */}
                        {currentStep >= 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: SIG_H }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    margin: '8px auto', border: `1px solid ${COLORS.border}`,
                                    borderRadius: '2px', overflow: 'hidden', width: SIG_W
                                }}
                            >
                                <canvas ref={sigCanvasRef} style={{ width: SIG_W, height: SIG_H, display: 'block' }} />
                            </motion.div>
                        )}

                        {/* Legend */}
                        <div style={{
                            display: 'flex', gap: 20, justifyContent: 'center', margin: '8px 0',
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                            textTransform: 'uppercase', letterSpacing: '0.04em', color: COLORS.fgMuted
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    backgroundColor: CLASS_COLORS[0], display: 'inline-block'
                                }} />
                                Class 0
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{
                                    width: 10, height: 10, transform: 'rotate(45deg)',
                                    backgroundColor: CLASS_COLORS[1], display: 'inline-block'
                                }} />
                                Class 1
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{
                                    width: 16, height: 2,
                                    backgroundColor: '#0a0a0a', display: 'inline-block',
                                    borderTop: '1px dashed #0a0a0a'
                                }} />
                                Boundary
                            </span>
                        </div>

                        {/* Controls */}
                        <ControlsRow>
                            <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

                            {running && <StepCounter current={currentStep + 1} total={steps.length} />}

                            <ControlButton onClick={startGD} disabled={running && !isPaused} variant="primary">
                                {running ? 'Training…' : 'Start Training'}
                            </ControlButton>

                            {running && (
                                <ControlButton onClick={togglePause} variant="success">
                                    {isPaused ? 'Resume' : 'Pause'}
                                </ControlButton>
                            )}

                            <ControlButton onClick={regenerate} disabled={running} variant="danger">
                                New Data
                            </ControlButton>

                            <ControlButton onClick={reset} variant="danger">
                                Reset
                            </ControlButton>
                        </ControlsRow>

                        {/* Final Result */}
                        <AnimatePresence>
                            {isFinalStep && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        marginTop: 20, padding: '12px 20px',
                                        background: COLORS.surface,
                                        border: `1px solid ${COLORS.sorted}`,
                                        borderLeft: `3px solid ${COLORS.sorted}`,
                                        borderRadius: '0px',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontWeight: 600, fontSize: 14, color: COLORS.fg,
                                        display: 'inline-block'
                                    }}
                                >
                                    ✓ Accuracy: {(step.accuracy * 100).toFixed(1)}% — boundary at x={step.w !== 0 ? (-step.b / step.w).toFixed(2) : '∞'}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
