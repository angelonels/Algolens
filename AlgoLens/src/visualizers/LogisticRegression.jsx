import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
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

// ═══ Constants ═══
const W = 480, H = 320, PAD = 44
const SIG_W = 480, SIG_H = 150
const COST_W = 480, COST_H = 120
const CLASS_COLORS = { 0: '#2563eb', 1: '#e63312' }
const CLASS_GLOW = { 0: 'rgba(37,99,235,0.35)', 1: 'rgba(230,51,18,0.35)' }

// ═══ Sigmoid ═══
function sigmoid(z) {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))))
}

// ═══ Data Generation ═══
function generateData(n = 40, noise = 1.5) {
    const points = []
    const sep = 2.5 + Math.random() * 1.5
    for (let i = 0; i < n; i++) {
        const label = i < n / 2 ? 0 : 1
        const center = label === 0 ? -sep / 2 : sep / 2
        const x = center + (Math.random() - 0.5) * noise * 2
        const y = (Math.random() - 0.5) * 3
        points.push({ x, y, label, id: `p-${i}-${Math.random().toString(36).slice(2, 6)}` })
    }
    return points.sort(() => Math.random() - 0.5)
}

// ═══ Gradient Descent ═══
function computeLogRegSteps(points, lr = 0.3, maxEpochs = 50) {
    let w = 0, b = 0
    const n = points.length
    const steps = []

    const getAccuracy = (w, b) =>
        points.filter(p => (sigmoid(w * p.x + b) >= 0.5 ? 1 : 0) === p.label).length / n

    const getCost = (w, b) =>
        -points.reduce((s, p) => {
            const pred = sigmoid(w * p.x + b)
            return s + p.label * Math.log(pred + 1e-8) + (1 - p.label) * Math.log(1 - pred + 1e-8)
        }, 0) / n

    steps.push({
        w, b,
        cost: getCost(w, b),
        epoch: 0,
        accuracy: getAccuracy(w, b),
        dw: 0, db: 0,
        phase: 'init',
        message: 'Initializing: w=0, b=0 — random guessing'
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

        const cost = getCost(w, b)
        const accuracy = getAccuracy(w, b)
        const converged = Math.abs(dw) < 0.005 && Math.abs(db) < 0.005

        steps.push({
            w, b, cost, epoch, accuracy, dw, db,
            phase: converged ? 'converged' : 'training',
            message: converged
                ? `✓ Converged at epoch ${epoch} — accuracy ${(accuracy * 100).toFixed(1)}%`
                : `Epoch ${epoch}: w=${w.toFixed(3)}, b=${b.toFixed(3)}, acc=${(accuracy * 100).toFixed(1)}%`
        })

        if (converged) break
    }

    if (steps[steps.length - 1].phase !== 'converged') {
        const last = steps[steps.length - 1]
        last.phase = 'converged'
        last.message = `✓ Complete — accuracy ${(last.accuracy * 100).toFixed(1)}%, boundary x=${last.w !== 0 ? (-last.b / last.w).toFixed(2) : '∞'}`
    }

    return steps
}

// ═══ Confetti Particle ═══
function ConfettiParticle({ delay, color }) {
    const angle = Math.random() * Math.PI * 2
    const dist = 40 + Math.random() * 80
    const size = 3 + Math.random() * 5
    return (
        <motion.div
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
                opacity: 0,
                scale: 0,
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist - 30,
            }}
            transition={{ duration: 0.8 + Math.random() * 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'absolute', width: size, height: size,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                background: color, pointerEvents: 'none',
                left: '50%', top: '50%',
                transform: `rotate(${Math.random() * 360}deg)`
            }}
        />
    )
}

// ═══ Parameter Slider ═══
function ParamSlider({ label, value, min, max, step, onChange, unit = '', disabled }) {
    return (
        <div style={{ flex: '1 1 140px', minWidth: 130 }}>
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: 4
            }}>
                <label style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: COLORS.fgMuted
                }}>
                    {label}
                </label>
                <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                    fontWeight: 700, color: COLORS.fg
                }}>
                    {typeof value === 'number' && value < 1 ? value.toFixed(2) : value}{unit}
                </span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                disabled={disabled}
                style={{
                    width: '100%', height: 4, appearance: 'none', WebkitAppearance: 'none',
                    background: disabled
                        ? COLORS.border
                        : `linear-gradient(to right, ${COLORS.accent} 0%, ${COLORS.accent} ${((value - min) / (max - min)) * 100}%, ${COLORS.border} ${((value - min) / (max - min)) * 100}%, ${COLORS.border} 100%)`,
                    outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
                    borderRadius: 0, opacity: disabled ? 0.5 : 1,
                }}
            />
        </div>
    )
}

// ═══ Animated SVG Data Point ═══
function DataPoint({ cx, cy, label, isCorrect, isActive, delay = 0 }) {
    const baseColor = CLASS_COLORS[label]
    const glowColor = CLASS_GLOW[label]
    const wrongColor = 'rgba(220, 38, 38, 0.6)'
    const correctGlow = 'rgba(22, 163, 74, 0.4)'

    if (label === 1) {
        // Diamond shape
        const s = 7
        const path = `M ${cx} ${cy - s} L ${cx + s} ${cy} L ${cx} ${cy + s} L ${cx - s} ${cy} Z`
        return (
            <motion.g>
                {/* Glow ring */}
                <motion.path
                    d={path}
                    fill="none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: isActive ? (isCorrect ? 0.5 : 0.8) : 0,
                        scale: isActive ? (isCorrect ? 1.6 : [1.4, 1.8, 1.4]) : 0.5,
                        stroke: isActive ? (isCorrect ? correctGlow : wrongColor) : 'transparent',
                    }}
                    transition={isActive && !isCorrect
                        ? { scale: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 } }
                        : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                    }
                    strokeWidth={2}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
                {/* Ambient glow */}
                <motion.circle
                    cx={cx} cy={cy} r={14}
                    fill={glowColor}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: delay * 0.02, duration: 0.4 }}
                />
                {/* Main diamond */}
                <motion.path
                    d={path}
                    fill={baseColor}
                    stroke="#fff"
                    strokeWidth={1.5}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        delay: delay * 0.02,
                        type: 'spring', stiffness: 500, damping: 25
                    }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
            </motion.g>
        )
    }

    return (
        <motion.g>
            {/* Pulse ring for active misclassified */}
            <motion.circle
                cx={cx} cy={cy}
                r={12}
                fill="none"
                initial={{ opacity: 0, r: 6 }}
                animate={{
                    opacity: isActive ? (isCorrect ? 0.4 : 0.7) : 0,
                    r: isActive ? (isCorrect ? 14 : [11, 16, 11]) : 6,
                    stroke: isActive ? (isCorrect ? correctGlow : wrongColor) : 'transparent',
                }}
                transition={isActive && !isCorrect
                    ? { r: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 } }
                    : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                }
                strokeWidth={2}
            />
            {/* Ambient glow */}
            <motion.circle
                cx={cx} cy={cy} r={14}
                fill={glowColor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                transition={{ delay: delay * 0.02, duration: 0.4 }}
            />
            {/* Main circle */}
            <motion.circle
                cx={cx} cy={cy} r={5}
                fill={baseColor}
                stroke="#fff"
                strokeWidth={1.5}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    delay: delay * 0.02,
                    type: 'spring', stiffness: 500, damping: 25
                }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
        </motion.g>
    )
}

// ═══ Probability Heatmap Column ═══
function HeatmapColumn({ x, width, height, probability, yStart }) {
    return (
        <motion.rect
            x={x}
            y={yStart}
            width={width}
            height={height}
            initial={{ opacity: 0 }}
            animate={{
                opacity: 0.18,
                fill: probability > 0.5
                    ? `rgba(230, 51, 18, ${Math.min(0.25, (probability - 0.5) * 0.5)})`
                    : `rgba(37, 99, 235, ${Math.min(0.25, (0.5 - probability) * 0.5)})`
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
    )
}

// ═══ MAIN COMPONENT ═══
export default function LogisticRegressionVisualizer() {
    // ── Parameters ──
    const [learningRate, setLearningRate] = useState(0.3)
    const [maxEpochs, setMaxEpochs] = useState(50)
    const [dataCount, setDataCount] = useState(40)
    const [noiseLevel, setNoiseLevel] = useState(1.5)

    // ── State ──
    const [points, setPoints] = useState(() => generateData(40, 1.5))
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState(SPEED_PRESETS.normal)
    const [isPaused, setIsPaused] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)

    // ── Animated boundary position ──
    const boundarySpring = useSpring(0, { stiffness: 120, damping: 20 })

    // ── Derived ──
    const xMin = useMemo(() => Math.min(...points.map(p => p.x)) - 1, [points])
    const xMax = useMemo(() => Math.max(...points.map(p => p.x)) + 1, [points])
    const yMin = useMemo(() => Math.min(...points.map(p => p.y)) - 1, [points])
    const yMax = useMemo(() => Math.max(...points.map(p => p.y)) + 1, [points])

    const toX = useCallback(x => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD), [xMin, xMax])
    const toY = useCallback(y => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD), [yMin, yMax])

    const step = steps[currentStep] || { w: 0, b: 0, cost: 0, epoch: 0, accuracy: 0, dw: 0, db: 0, phase: 'idle', message: '' }

    // ── Heatmap columns ──
    const heatmapColumns = useMemo(() => {
        if (currentStep < 0) return []
        const cols = 30
        const colW = (W - 2 * PAD) / cols
        return Array.from({ length: cols }, (_, i) => {
            const xVal = xMin + ((i + 0.5) / cols) * (xMax - xMin)
            const prob = sigmoid(step.w * xVal + step.b)
            return { x: PAD + i * colW, width: colW + 0.5, probability: prob }
        })
    }, [currentStep, step.w, step.b, xMin, xMax])

    // ── Sigmoid path ──
    const sigmoidPath = useMemo(() => {
        if (currentStep < 0) return ''
        const sPad = 30
        const plotW = SIG_W - 2 * sPad
        const plotH = SIG_H - 48
        const xRange = 8
        let d = ''
        for (let px = 0; px <= plotW; px += 2) {
            const xVal = (px / plotW - 0.5) * xRange
            const z = step.w * xVal + step.b
            const sig = sigmoid(z)
            const sx = sPad + px
            const sy = 28 + plotH * (1 - sig)
            d += px === 0 ? `M ${sx} ${sy}` : ` L ${sx} ${sy}`
        }
        return d
    }, [currentStep, step.w, step.b])

    // ── Sigmoid area fill path ──
    const sigmoidFillPath = useMemo(() => {
        if (!sigmoidPath) return ''
        const sPad = 30
        const plotW = SIG_W - 2 * sPad
        const plotH = SIG_H - 48
        return sigmoidPath + ` L ${sPad + plotW} ${28 + plotH} L ${sPad} ${28 + plotH} Z`
    }, [sigmoidPath])

    // ── Cost curve path ──
    const costPath = useMemo(() => {
        if (currentStep < 0) return ''
        const costs = steps.slice(0, currentStep + 1).map(s => s.cost)
        if (costs.length < 1) return ''
        const maxCost = Math.max(...steps.map(s => s.cost)) * 1.1 || 1
        const cPad = 30
        const plotW = COST_W - cPad - 10
        const plotH = COST_H - 40
        let d = ''
        costs.forEach((c, i) => {
            const x = cPad + (i / Math.max(steps.length - 1, 1)) * plotW
            const y = 24 + (1 - c / maxCost) * plotH
            d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
        })
        return d
    }, [currentStep, steps])

    const costFillPath = useMemo(() => {
        if (!costPath) return ''
        const costs = steps.slice(0, currentStep + 1).map(s => s.cost)
        const maxCost = Math.max(...steps.map(s => s.cost)) * 1.1 || 1
        const cPad = 30
        const plotW = COST_W - cPad - 10
        const plotH = COST_H - 40
        const lastX = cPad + ((costs.length - 1) / Math.max(steps.length - 1, 1)) * plotW
        return costPath + ` L ${lastX} ${24 + plotH} L ${30} ${24 + plotH} Z`
    }, [costPath, currentStep, steps])

    // ── Current cost dot position ──
    const costDot = useMemo(() => {
        if (currentStep < 0) return null
        const costs = steps.slice(0, currentStep + 1).map(s => s.cost)
        if (!costs.length) return null
        const maxCost = Math.max(...steps.map(s => s.cost)) * 1.1 || 1
        const cPad = 30
        const plotW = COST_W - cPad - 10
        const plotH = COST_H - 40
        const x = cPad + ((costs.length - 1) / Math.max(steps.length - 1, 1)) * plotW
        const y = 24 + (1 - costs[costs.length - 1] / maxCost) * plotH
        return { x, y }
    }, [currentStep, steps])

    // ── Actions ──
    const startGD = () => {
        const s = computeLogRegSteps(points, learningRate, maxEpochs)
        setSteps(s)
        setCurrentStep(0)
        setRunning(true)
        setIsPaused(false)
        setShowConfetti(false)
    }

    const reset = () => {
        setSteps([])
        setCurrentStep(-1)
        setRunning(false)
        setIsPaused(false)
        setShowConfetti(false)
    }

    const regenerate = () => {
        reset()
        setPoints(generateData(dataCount, noiseLevel))
    }

    const togglePause = () => setIsPaused(!isPaused)

    // ── Auto-advance ──
    useEffect(() => {
        if (running && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const t = setTimeout(() => setCurrentStep(cs => cs + 1), speed)
            return () => clearTimeout(t)
        } else if (running && currentStep >= steps.length - 1) {
            setRunning(false)
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 2000)
        }
    }, [running, currentStep, steps, speed, isPaused])

    // ── Update boundary spring ──
    useEffect(() => {
        if (currentStep >= 0 && step.w !== 0) {
            boundarySpring.set(toX(-step.b / step.w))
        }
    }, [currentStep, step.w, step.b, toX])

    // ── Regenerate when data params change ──
    useEffect(() => {
        if (!running) {
            reset()
            setPoints(generateData(dataCount, noiseLevel))
        }
    }, [dataCount, noiseLevel])

    const isFinalStep = currentStep === steps.length - 1 && !running
    const isTraining = running || currentStep >= 0

    // ── Decision boundary position ──
    const boundaryX = currentStep >= 0 && step.w !== 0 ? toX(-step.b / step.w) : null

    // ── Grid lines for scatter ──
    const gridLines = useMemo(() => {
        const lines = []
        for (let i = 0; i <= 5; i++) {
            const gx = PAD + (i / 5) * (W - 2 * PAD)
            const gy = PAD + (i / 5) * (H - 2 * PAD)
            lines.push({ x1: gx, y1: PAD, x2: gx, y2: H - PAD, key: `vg-${i}` })
            lines.push({ x1: PAD, y1: gy, x2: W - PAD, y2: gy, key: `hg-${i}` })
        }
        return lines
    }, [])

    // ── Confetti colors ──
    const confettiColors = ['#16a34a', '#2563eb', '#e63312', '#d97706', '#7c3aed', '#0891b2']

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
                        {/* ═══ PARAMETER CONTROLS ═══ */}
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                display: 'flex', gap: 16, flexWrap: 'wrap',
                                padding: '16px 20px',
                                background: COLORS.bgAlt,
                                border: `1px solid ${COLORS.border}`,
                                marginBottom: 16,
                            }}
                        >
                            <ParamSlider
                                label="Learning Rate" value={learningRate}
                                min={0.01} max={1.0} step={0.01}
                                onChange={setLearningRate} disabled={running}
                            />
                            <ParamSlider
                                label="Max Epochs" value={maxEpochs}
                                min={10} max={200} step={10}
                                onChange={setMaxEpochs} disabled={running}
                            />
                            <ParamSlider
                                label="Data Points" value={dataCount}
                                min={20} max={100} step={10}
                                onChange={setDataCount} disabled={running}
                            />
                            <ParamSlider
                                label="Noise" value={noiseLevel}
                                min={0.5} max={3.0} step={0.1}
                                onChange={setNoiseLevel} disabled={running}
                            />
                        </motion.div>

                        {/* ═══ STATUS MESSAGE ═══ */}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={step.phase === 'converged' ? 'success' : 'info'}
                                />
                            )}
                        </AnimatePresence>

                        {/* ═══ MAIN SVG SCATTER PLOT ═══ */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                margin: '12px auto',
                                border: `1px solid ${COLORS.border}`,
                                overflow: 'hidden', width: W, position: 'relative',
                                background: '#fafaf8'
                            }}
                        >
                            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
                                {/* Background */}
                                <rect x={0} y={0} width={W} height={H} fill="#fafaf8" />

                                {/* Probability heatmap */}
                                <AnimatePresence>
                                    {currentStep >= 0 && heatmapColumns.map((col, i) => (
                                        <HeatmapColumn
                                            key={`hm-${i}`}
                                            x={col.x}
                                            width={col.width}
                                            height={H - 2 * PAD}
                                            probability={col.probability}
                                            yStart={PAD}
                                        />
                                    ))}
                                </AnimatePresence>

                                {/* Grid */}
                                {gridLines.map(l => (
                                    <line key={l.key}
                                        x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                                        stroke="#e8e4dc" strokeWidth={0.5}
                                    />
                                ))}

                                {/* Axes */}
                                <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#0a0a0a" strokeWidth={1.5} />
                                <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#0a0a0a" strokeWidth={1.5} />

                                {/* Axis labels */}
                                {[0, 1, 2, 3, 4].map(i => {
                                    const xVal = xMin + (i / 4) * (xMax - xMin)
                                    return (
                                        <text
                                            key={`xl-${i}`}
                                            x={PAD + (i / 4) * (W - 2 * PAD)}
                                            y={H - PAD + 16}
                                            textAnchor="middle"
                                            fill="#666"
                                            fontFamily="'JetBrains Mono', monospace"
                                            fontSize={10}
                                        >
                                            {xVal.toFixed(1)}
                                        </text>
                                    )
                                })}

                                {/* Decision boundary glow trail */}
                                {boundaryX !== null && (
                                    <motion.line
                                        x1={boundaryX} y1={PAD} x2={boundaryX} y2={H - PAD}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.12 }}
                                        stroke="#0a0a0a"
                                        strokeWidth={10}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                )}

                                {/* Decision boundary main */}
                                {boundaryX !== null && (
                                    <motion.line
                                        x1={boundaryX} y1={PAD} x2={boundaryX} y2={H - PAD}
                                        initial={{ opacity: 0, x1: W / 2, x2: W / 2 }}
                                        animate={{ opacity: 1, x1: boundaryX, x2: boundaryX }}
                                        stroke="#0a0a0a"
                                        strokeWidth={2}
                                        strokeDasharray="6 4"
                                        transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                                    />
                                )}

                                {/* Decision boundary label */}
                                {boundaryX !== null && step.w !== 0 && (
                                    <motion.text
                                        x={boundaryX} y={PAD - 8}
                                        textAnchor="middle"
                                        fill="#0a0a0a"
                                        fontFamily="'JetBrains Mono', monospace"
                                        fontSize={10} fontWeight="bold"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.3 }}
                                    >
                                        x={(-step.b / step.w).toFixed(2)}
                                    </motion.text>
                                )}

                                {/* Gradient arrow (direction of boundary movement) */}
                                {currentStep > 0 && boundaryX !== null && Math.abs(step.dw) > 0.01 && (
                                    <motion.g
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.line
                                            x1={boundaryX}
                                            y1={H / 2}
                                            x2={boundaryX + (step.dw > 0 ? -20 : 20)}
                                            y2={H / 2}
                                            stroke={COLORS.accent}
                                            strokeWidth={2.5}
                                            markerEnd="url(#arrowhead)"
                                            animate={{
                                                x2: boundaryX + (step.dw > 0 ? -20 : 20),
                                            }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                        />
                                    </motion.g>
                                )}

                                {/* Arrowhead marker */}
                                <defs>
                                    <marker id="arrowhead" markerWidth="8" markerHeight="6"
                                        refX="8" refY="3" orient="auto">
                                        <polygon points="0 0, 8 3, 0 6" fill={COLORS.accent} />
                                    </marker>
                                </defs>

                                {/* Data points */}
                                {points.map((p, i) => {
                                    const predicted = currentStep >= 0
                                        ? (sigmoid(step.w * p.x + step.b) >= 0.5 ? 1 : 0)
                                        : p.label
                                    return (
                                        <DataPoint
                                            key={p.id}
                                            cx={toX(p.x)}
                                            cy={toY(p.y)}
                                            label={p.label}
                                            isCorrect={predicted === p.label}
                                            isActive={currentStep >= 0}
                                            delay={i}
                                        />
                                    )
                                })}
                            </svg>

                            {/* Confetti overlay */}
                            <AnimatePresence>
                                {showConfetti && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        pointerEvents: 'none', overflow: 'hidden'
                                    }}>
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <ConfettiParticle
                                                key={i}
                                                delay={i * 0.03}
                                                color={confettiColors[i % confettiColors.length]}
                                            />
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* ═══ STATS BAR ═══ */}
                        <AnimatePresence>
                            {currentStep >= 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        display: 'flex', gap: 8, justifyContent: 'center',
                                        flexWrap: 'wrap', margin: '10px 0'
                                    }}
                                >
                                    {[
                                        { label: 'EPOCH', val: step.epoch, accent: false },
                                        { label: 'WEIGHT', val: step.w.toFixed(3), accent: false },
                                        { label: 'BIAS', val: step.b.toFixed(3), accent: false },
                                        { label: 'COST', val: step.cost.toFixed(4), accent: step.cost < 0.3 },
                                        { label: 'ACC', val: `${(step.accuracy * 100).toFixed(1)}%`, accent: step.accuracy > 0.9 }
                                    ].map(({ label, val, accent }) => (
                                        <motion.div
                                            key={label}
                                            layout
                                            style={{
                                                padding: '5px 10px',
                                                background: accent ? 'rgba(22,163,74,0.06)' : COLORS.surface,
                                                border: `1px solid ${accent ? COLORS.sorted : COLORS.border}`,
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: 10, fontWeight: 600,
                                                textTransform: 'uppercase', letterSpacing: '0.04em',
                                                color: COLORS.fgMuted,
                                                transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)'
                                            }}
                                        >
                                            <span style={{
                                                color: accent ? COLORS.sorted : COLORS.fg,
                                                fontWeight: 700
                                            }}>{val}</span>{' '}{label}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ═══ SIGMOID CURVE (SVG) ═══ */}
                        <AnimatePresence>
                            {currentStep >= 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: SIG_H }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        margin: '8px auto', border: `1px solid ${COLORS.border}`,
                                        overflow: 'hidden', width: SIG_W, background: '#fafaf8'
                                    }}
                                >
                                    <svg width={SIG_W} height={SIG_H} viewBox={`0 0 ${SIG_W} ${SIG_H}`}>
                                        <rect width={SIG_W} height={SIG_H} fill="#fafaf8" />

                                        {/* Label */}
                                        <text x={30} y={16} fill="#666" fontFamily="'JetBrains Mono', monospace"
                                            fontSize={9} fontWeight="bold">
                                            SIGMOID: σ(wx + b)
                                        </text>

                                        {/* 0.5 threshold */}
                                        <line
                                            x1={30} y1={28 + (SIG_H - 48) * 0.5}
                                            x2={SIG_W - 30} y2={28 + (SIG_H - 48) * 0.5}
                                            stroke="#d4d0c8" strokeWidth={1} strokeDasharray="4 4"
                                        />
                                        <text x={26} y={28 + (SIG_H - 48) * 0.5 + 3}
                                            fill="#999" fontFamily="'JetBrains Mono', monospace"
                                            fontSize={9} textAnchor="end">0.5</text>
                                        <text x={26} y={32}
                                            fill="#999" fontFamily="'JetBrains Mono', monospace"
                                            fontSize={9} textAnchor="end">1.0</text>
                                        <text x={26} y={28 + (SIG_H - 48) + 4}
                                            fill="#999" fontFamily="'JetBrains Mono', monospace"
                                            fontSize={9} textAnchor="end">0.0</text>

                                        {/* Gradient fill under curve */}
                                        <defs>
                                            <linearGradient id="sigFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#e63312" stopOpacity="0.15" />
                                                <stop offset="100%" stopColor="#e63312" stopOpacity="0.01" />
                                            </linearGradient>
                                        </defs>
                                        {sigmoidFillPath && (
                                            <motion.path
                                                d={sigmoidFillPath}
                                                fill="url(#sigFill)"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            />
                                        )}

                                        {/* Sigmoid curve with smooth morphing */}
                                        {sigmoidPath && (
                                            <motion.path
                                                d={sigmoidPath}
                                                fill="none"
                                                stroke="#e63312"
                                                strokeWidth={2.5}
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 1 }}
                                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                            />
                                        )}

                                        {/* Decision boundary marker on sigmoid */}
                                        {step.w !== 0 && (() => {
                                            const sPad = 30
                                            const plotW = SIG_W - 2 * sPad
                                            const boundary = -step.b / step.w
                                            const xRange = 8
                                            const bpx = sPad + ((boundary / xRange + 0.5)) * plotW
                                            const halfY = 28 + (SIG_H - 48) * 0.5
                                            if (bpx > sPad && bpx < SIG_W - sPad) {
                                                return (
                                                    <motion.circle
                                                        cx={bpx} cy={halfY} r={5}
                                                        fill="#0a0a0a" stroke="#fff" strokeWidth={2}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: [1, 1.3, 1] }}
                                                        transition={{
                                                            scale: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
                                                        }}
                                                    />
                                                )
                                            }
                                            return null
                                        })()}
                                    </svg>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ═══ COST CURVE (SVG) ═══ */}
                        <AnimatePresence>
                            {currentStep >= 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: COST_H }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        margin: '8px auto', border: `1px solid ${COLORS.border}`,
                                        overflow: 'hidden', width: COST_W, background: '#fafaf8'
                                    }}
                                >
                                    <svg width={COST_W} height={COST_H} viewBox={`0 0 ${COST_W} ${COST_H}`}>
                                        <rect width={COST_W} height={COST_H} fill="#fafaf8" />

                                        {/* Label */}
                                        <text x={30} y={14} fill="#666" fontFamily="'JetBrains Mono', monospace"
                                            fontSize={9} fontWeight="bold">
                                            COST (CROSS-ENTROPY)
                                        </text>

                                        {/* Current cost value */}
                                        <text x={COST_W - 12} y={14} fill="#0a0a0a"
                                            fontFamily="'JetBrains Mono', monospace"
                                            fontSize={10} fontWeight="bold" textAnchor="end">
                                            {step.cost.toFixed(4)}
                                        </text>

                                        {/* Axes */}
                                        <line x1={30} y1={24} x2={30} y2={COST_H - 16}
                                            stroke="#d4d0c8" strokeWidth={1} />
                                        <line x1={30} y1={COST_H - 16} x2={COST_W - 10} y2={COST_H - 16}
                                            stroke="#d4d0c8" strokeWidth={1} />

                                        {/* Gradient fill under cost curve */}
                                        <defs>
                                            <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#e63312" stopOpacity="0.18" />
                                                <stop offset="100%" stopColor="#e63312" stopOpacity="0.01" />
                                            </linearGradient>
                                        </defs>
                                        {costFillPath && (
                                            <motion.path
                                                d={costFillPath}
                                                fill="url(#costFill)"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}

                                        {/* Cost curve line */}
                                        {costPath && (
                                            <motion.path
                                                d={costPath}
                                                fill="none"
                                                stroke="#e63312"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            />
                                        )}

                                        {/* Current cost dot */}
                                        {costDot && (
                                            <motion.g>
                                                {/* Pulse ring */}
                                                <motion.circle
                                                    cx={costDot.x} cy={costDot.y} r={4}
                                                    fill="none" stroke="#e63312" strokeWidth={1.5}
                                                    animate={{
                                                        r: [4, 8, 4],
                                                        opacity: [0.8, 0, 0.8],
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        ease: 'easeInOut'
                                                    }}
                                                />
                                                {/* Dot */}
                                                <motion.circle
                                                    cx={costDot.x} cy={costDot.y} r={4}
                                                    fill="#e63312" stroke="#fff" strokeWidth={1.5}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        type: 'spring', stiffness: 500, damping: 25
                                                    }}
                                                />
                                            </motion.g>
                                        )}
                                    </svg>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ═══ LEGEND ═══ */}
                        <div style={{
                            display: 'flex', gap: 20, justifyContent: 'center', margin: '10px 0',
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

                        {/* ═══ CONTROLS ═══ */}
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

                        {/* ═══ FINAL RESULT ═══ */}
                        <AnimatePresence>
                            {isFinalStep && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{
                                        type: 'spring', stiffness: 300, damping: 25
                                    }}
                                    style={{
                                        marginTop: 20, padding: '14px 24px',
                                        background: 'rgba(22,163,74,0.04)',
                                        border: `1px solid ${COLORS.sorted}`,
                                        borderLeft: `4px solid ${COLORS.sorted}`,
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontWeight: 600, fontSize: 14, color: COLORS.fg,
                                        display: 'inline-block'
                                    }}
                                >
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        ✓ Accuracy: {(step.accuracy * 100).toFixed(1)}%
                                    </motion.span>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        style={{ color: COLORS.fgMuted, marginLeft: 8 }}
                                    >
                                        — boundary at x={step.w !== 0 ? (-step.b / step.w).toFixed(2) : '∞'}
                                    </motion.span>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        style={{ color: COLORS.fgMuted, marginLeft: 8, fontSize: 12 }}
                                    >
                                        ({step.epoch} epochs, lr={learningRate})
                                    </motion.span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
