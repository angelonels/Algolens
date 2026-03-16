import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer, ControlsRow,
    SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'
import { KMEANS_CODE } from '../data/algorithmCodes'


const CLUSTER_COLORS = ['#e63312', '#2563eb', '#16a34a', '#9333ea', '#f59e0b']
const CLUSTER_BG = ['#fee2e2', '#dbeafe', '#dcfce7', '#f3e8ff', '#fef3c7']
const CANVAS_W = 460
const CANVAS_H = 380

function generatePoints(n = 60) {
    const points = []
    // Generate clusters of points for more interesting results
    const centers = [
        [0.25, 0.3], [0.75, 0.25], [0.5, 0.75], [0.2, 0.7], [0.8, 0.7]
    ]
    for (let i = 0; i < n; i++) {
        const ci = Math.floor(Math.random() * centers.length)
        const [cx, cy] = centers[ci]
        points.push([
            Math.max(0.05, Math.min(0.95, cx + (Math.random() - 0.5) * 0.35)),
            Math.max(0.05, Math.min(0.95, cy + (Math.random() - 0.5) * 0.35))
        ])
    }
    return points
}

function dist(a, b) {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
}

function computeKMeansSteps(points, k, maxIter = 20) {
    const steps = []
    // Pick k random points as initial centroids
    const shuffled = [...points].sort(() => Math.random() - 0.5)
    let centroids = shuffled.slice(0, k).map(p => [...p])

    steps.push({
        points,
        centroids: centroids.map(c => [...c]),
        assignments: new Array(points.length).fill(-1),
        phase: 'init',
        iteration: 0,
        message: `Initialized ${k} random centroids`
    })

    for (let iter = 1; iter <= maxIter; iter++) {
        // Assignment step
        const assignments = points.map(p => {
            let minD = Infinity, closest = 0
            centroids.forEach((c, ci) => {
                const d = dist(p, c)
                if (d < minD) { minD = d; closest = ci }
            })
            return closest
        })

        steps.push({
            points,
            centroids: centroids.map(c => [...c]),
            assignments: [...assignments],
            phase: 'assign',
            iteration: iter,
            message: `Iteration ${iter}: assigned ${points.length} points to ${k} clusters`
        })

        // Update step
        const newCentroids = centroids.map((_, ci) => {
            const cluster = points.filter((_, pi) => assignments[pi] === ci)
            if (cluster.length === 0) return centroids[ci]
            return [
                cluster.reduce((s, p) => s + p[0], 0) / cluster.length,
                cluster.reduce((s, p) => s + p[1], 0) / cluster.length
            ]
        })

        const moved = centroids.some((c, i) => dist(c, newCentroids[i]) > 0.001)
        centroids = newCentroids

        steps.push({
            points,
            centroids: centroids.map(c => [...c]),
            assignments: [...assignments],
            phase: moved ? 'update' : 'converged',
            iteration: iter,
            message: moved
                ? `Iteration ${iter}: moved centroids to cluster means`
                : `✓ Converged after ${iter} iteration${iter > 1 ? 's' : ''} — centroids stopped moving`
        })

        if (!moved) break
    }

    return steps
}

export default function KMeansVisualizer() {
    const [k, setK] = useState(3)
    const [points, setPoints] = useState(() => generatePoints())
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState(SPEED_PRESETS.slow)
    const [isPaused, setIsPaused] = useState(false)

    const startKMeans = () => {
        const s = computeKMeansSteps(points, k)
        setSteps(s)
        setCurrentStep(0)
        setRunning(true)
        setIsPaused(false)
    }

    const reset = () => {
        setSteps([])
        setCurrentStep(-1)
        setRunning(false)
        setIsPaused(false)
    }

    const regenerate = () => {
        reset()
        setPoints(generatePoints())
    }

    const togglePause = () => setIsPaused(!isPaused)

    useEffect(() => {
        if (running && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const t = setTimeout(() => setCurrentStep(cs => cs + 1), SPEED_PRESETS[speed])
            return () => clearTimeout(t)
        } else if (running && currentStep >= steps.length - 1) {
            setRunning(false)
        }
    }, [running, currentStep, steps, speed, isPaused])

    const step = steps[currentStep] || {
        points,
        centroids: [],
        assignments: new Array(points.length).fill(-1),
        phase: 'idle',
        iteration: 0,
        message: ''
    }

    const isFinalStep = steps.length > 0 && currentStep === steps.length - 1 && !running

    const labelStyle = {
        fontWeight: 600,
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--fg-muted)'
    }

    return (
        <PageContainer title="K-Means Clustering">
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is K-Means Clustering?</h3>
                        <p>
                            K-Means is one of the most popular <strong>unsupervised machine learning</strong> algorithms.
                            Given a set of data points, it partitions them into <strong>k clusters</strong> where each
                            point belongs to the cluster with the nearest <strong>centroid</strong> (center of mass).
                        </p>
                        <p className="mt-2 text-sm text-[var(--fg-muted)] leading-relaxed">
                            The algorithm alternates between two steps — <strong>assigning</strong> points to the
                            nearest centroid and <strong>updating</strong> centroids to the mean of their assigned
                            points — until convergence. Despite its simplicity, K-Means is remarkably effective
                            and forms the foundation of many clustering applications.
                        </p>
                        <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
                        <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
                            <li>Choose k random points as initial centroids</li>
                            <li><strong>Assignment step:</strong> Assign each point to its nearest centroid (using Euclidean distance)</li>
                            <li><strong>Update step:</strong> Move each centroid to the mean position of all points assigned to it</li>
                            <li>Repeat steps 2–3 until centroids stop moving (convergence)</li>
                        </ol>
                        <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">Key Characteristics</h4>
                        <ul className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
                            <li><strong>Unsupervised:</strong> No labeled training data required</li>
                            <li><strong>Iterative:</strong> Guaranteed to converge, but may find local minima</li>
                            <li><strong>Sensitive to initialization:</strong> Different starting centroids can yield different results</li>
                            <li><strong>Requires choosing k:</strong> The number of clusters must be specified in advance</li>
                        </ul>
                        <p className="mt-3 text-sm text-[var(--fg-muted)] leading-relaxed">
                            <strong>Time Complexity:</strong> O(n · k · i) where n = points, k = clusters, i = iterations
                        </p>
                        <p className="mt-1 text-sm text-[var(--fg-muted)] leading-relaxed">
                            <strong>Space Complexity:</strong> O(n + k) for storing assignments and centroids
                        </p>
                        <p className="mt-3 text-xs text-[var(--fg-muted)] leading-relaxed">
                            <strong>Real-world uses:</strong> Customer segmentation, image compression (color quantization),
                            anomaly detection, document clustering, recommendation systems, and market analysis.
                        </p>
                    </ExplanationBox>

                    <CodeBlock codes={KMEANS_CODE} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {/* Config */}
                        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <label style={labelStyle}>Clusters (k)</label>
                            <select
                                value={k}
                                onChange={e => { setK(Number(e.target.value)); reset() }}
                                disabled={running}
                                style={{
                                    fontSize: 13,
                                    padding: '4px 8px',
                                    border: `1px solid ${'var(--border)'}`,
                                    borderRadius: '0px',
                                    background: 'var(--surface)',
                                    cursor: 'pointer'
                                }}
                            >
                                {[2, 3, 4, 5].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Message */}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={step.phase === 'converged' ? 'success' : step.phase === 'assign' ? 'compare' : 'info'}
                                />
                            )}
                        </AnimatePresence>

                        {/* Scatter Plot */}
                        <div style={{
                            position: 'relative',
                            width: CANVAS_W,
                            height: CANVAS_H,
                            margin: '16px auto',
                            background: 'var(--surface)',
                            border: `1px solid ${'var(--border)'}`,
                            overflow: 'hidden'
                        }}>
                            {/* Data Points */}
                            {step.points.map((p, i) => {
                                const a = step.assignments[i]
                                const color = a >= 0 ? CLUSTER_COLORS[a % CLUSTER_COLORS.length] : 'var(--fg-muted)'
                                return (
                                    <motion.div
                                        key={`p-${i}`}
                                        animate={{
                                            left: p[0] * CANVAS_W - 5,
                                            top: p[1] * CANVAS_H - 5,
                                            backgroundColor: color,
                                            scale: 1
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        style={{
                                            position: 'absolute',
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            border: '1.5px solid rgba(0,0,0,0.15)'
                                        }}
                                    />
                                )
                            })}

                            {/* Centroids */}
                            {step.centroids.map((c, ci) => (
                                <motion.div
                                    key={`c-${ci}`}
                                    animate={{
                                        left: c[0] * CANVAS_W - 12,
                                        top: c[1] * CANVAS_H - 12,
                                        backgroundColor: CLUSTER_COLORS[ci % CLUSTER_COLORS.length],
                                        scale: step.phase === 'update' || step.phase === 'converged' ? 1.2 : 1
                                    }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                    style={{
                                        position: 'absolute',
                                        width: 24,
                                        height: 24,
                                        borderRadius: '2px',
                                        border: '2.5px solid #fff',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: '#fff',
                                        zIndex: 10
                                    }}
                                >
                                    {ci + 1}
                                </motion.div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 16,
                            justifyContent: 'center',
                            padding: '12px 0',
                            borderTop: `1px solid ${'var(--border)'}`,
                            marginBottom: 8
                        }}>
                            {Array.from({ length: k }, (_, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    color: 'var(--fg-muted)'
                                }}>
                                    <div style={{
                                        width: 10, height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: CLUSTER_COLORS[i]
                                    }} />
                                    Cluster {i + 1}
                                    <div style={{
                                        width: 14, height: 14,
                                        borderRadius: '2px',
                                        backgroundColor: CLUSTER_COLORS[i],
                                        border: '1.5px solid #fff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                        marginLeft: -2
                                    }} />
                                    Centroid
                                </div>
                            ))}
                        </div>

                        {/* Controls */}
                        <ControlsRow>
                            <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

                            {running && <StepCounter current={currentStep + 1} total={steps.length} />}

                            <ControlButton onClick={startKMeans} disabled={running && !isPaused} variant="primary">
                                {running ? 'Clustering…' : 'Start K-Means'}
                            </ControlButton>

                            {running && (
                                <ControlButton onClick={togglePause} variant="success">
                                    {isPaused ? 'Resume' : 'Pause'}
                                </ControlButton>
                            )}

                            <ControlButton onClick={regenerate} disabled={running} variant="danger">
                                New Points
                            </ControlButton>

                            <ControlButton onClick={reset} variant="danger">
                                Reset
                            </ControlButton>
                        </ControlsRow>

                        {/* Final Result */}
                        <AnimatePresence>
                            {isFinalStep && step.phase === 'converged' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        marginTop: 24,
                                        padding: '12px 20px',
                                        background: 'var(--surface)',
                                        border: `1px solid ${'var(--color-sorted)'}`,
                                        borderLeft: `3px solid ${'var(--color-sorted)'}`,
                                        borderRadius: '0px',
                                        fontWeight: 600,
                                        fontSize: 15,
                                        color: 'var(--fg)',
                                        display: 'inline-block'
                                    }}
                                >
                                    ✓ Converged — {k} clusters, {step.iteration} iterations
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
