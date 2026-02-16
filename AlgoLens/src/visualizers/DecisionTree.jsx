import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, COLORS, SPRING } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer, ControlsRow,
    SplitLayout, SplitLeft, SplitRight
} from '../components/ui/AnimationComponents'

const dtPythonCode = `class DecisionTree:
    def __init__(self, max_depth=4):
        self.max_depth = max_depth
    
    def gini(self, groups, classes):
        total = sum(len(g) for g in groups)
        score = 0.0
        for group in groups:
            if len(group) == 0: continue
            s = 0.0
            for c in classes:
                p = [r[-1] for r in group].count(c) / len(group)
                s += p * p
            score += (1 - s) * len(group) / total
        return score
    
    def split(self, data, feature, value):
        left = [r for r in data if r[feature] < value]
        right = [r for r in data if r[feature] >= value]
        return left, right
    
    def best_split(self, data):
        classes = list(set(r[-1] for r in data))
        best = {'gini': 1.0}
        for feat in range(len(data[0]) - 1):
            for row in data:
                left, right = self.split(data, feat, row[feat])
                g = self.gini([left, right], classes)
                if g < best['gini']:
                    best = {'feature': feat, 'value': row[feat],
                            'gini': g, 'groups': (left, right)}
        return best`

const CLASS_COLORS = ['#2563eb', '#e63312', '#16a34a']
const CLASS_BG = ['rgba(37,99,235,0.08)', 'rgba(230,51,18,0.08)', 'rgba(22,163,74,0.08)']
const W = 460, H = 340

// ── Data Generation ──
function generateData(nPerClass = 25) {
    const points = []
    const configs = [
        { cx: 1.5, cy: 1.5, label: 0 },
        { cx: 3.5, cy: 3.5, label: 1 },
        { cx: 3.5, cy: 1.0, label: 2 }
    ]
    configs.forEach(({ cx, cy, label }) => {
        for (let i = 0; i < nPerClass; i++) {
            points.push({
                x: cx + (Math.random() - 0.5) * 2.5,
                y: cy + (Math.random() - 0.5) * 2.5,
                label
            })
        }
    })
    return points.sort(() => Math.random() - 0.5)
}

// ── Decision Tree Helpers ──
function gini(groups, classes) {
    const total = groups.reduce((s, g) => s + g.length, 0)
    if (total === 0) return 0
    let score = 0
    groups.forEach(group => {
        if (group.length === 0) return
        let s = 0
        classes.forEach(c => {
            const p = group.filter(r => r.label === c).length / group.length
            s += p * p
        })
        score += (1 - s) * (group.length / total)
    })
    return score
}

function findBestSplit(data, classes) {
    let best = { gini: 1, feature: null, value: null }
    const features = ['x', 'y']

    features.forEach((feat, fi) => {
        const vals = [...new Set(data.map(p => p[feat]))].sort((a, b) => a - b)
        for (let i = 0; i < vals.length - 1; i++) {
            const threshold = (vals[i] + vals[i + 1]) / 2
            const left = data.filter(p => p[feat] < threshold)
            const right = data.filter(p => p[feat] >= threshold)
            const g = gini([left, right], classes)
            if (g < best.gini) {
                best = { gini: g, feature: feat, featureIdx: fi, value: threshold, left, right }
            }
        }
    })
    return best
}

function buildTreeSteps(data, maxDepth = 4) {
    const classes = [...new Set(data.map(p => p.label))]
    const steps = []
    let nodeId = 0

    // Tree structure for rendering
    const tree = {}
    const splits = [] // accumulated split lines for the scatter plot

    steps.push({
        tree: {},
        splits: [],
        activeNode: null,
        phase: 'init',
        depth: 0,
        message: `Starting with ${data.length} data points, ${classes.length} classes`
    })

    function recurse(nodeData, depth, parentId, side, bounds) {
        const id = nodeId++
        const majorityClass = classes.reduce((best, c) => {
            const count = nodeData.filter(p => p.label === c).length
            return count > best.count ? { class: c, count } : best
        }, { class: 0, count: 0 }).class

        const pure = nodeData.every(p => p.label === majorityClass)

        if (pure || depth >= maxDepth || nodeData.length <= 2) {
            tree[id] = {
                id, depth, parentId, side, leaf: true,
                prediction: majorityClass,
                count: nodeData.length,
                bounds
            }

            steps.push({
                tree: JSON.parse(JSON.stringify(tree)),
                splits: [...splits],
                activeNode: id,
                phase: 'leaf',
                depth,
                message: pure
                    ? `Leaf node: all ${nodeData.length} points are class ${majorityClass} (pure)`
                    : `Leaf node: majority class ${majorityClass} (${nodeData.filter(p => p.label === majorityClass).length}/${nodeData.length}), max depth reached`
            })
            return
        }

        const best = findBestSplit(nodeData, classes)

        if (!best.feature) {
            tree[id] = { id, depth, parentId, side, leaf: true, prediction: majorityClass, count: nodeData.length, bounds }
            steps.push({
                tree: JSON.parse(JSON.stringify(tree)),
                splits: [...splits],
                activeNode: id,
                phase: 'leaf',
                depth,
                message: `Leaf node: no valid split found`
            })
            return
        }

        tree[id] = {
            id, depth, parentId, side, leaf: false,
            feature: best.feature, value: best.value,
            gini: best.gini, count: nodeData.length,
            bounds
        }

        const splitLine = {
            feature: best.feature,
            value: best.value,
            bounds: { ...bounds },
            depth
        }
        splits.push(splitLine)

        steps.push({
            tree: JSON.parse(JSON.stringify(tree)),
            splits: [...splits],
            activeNode: id,
            phase: 'split',
            depth,
            message: `Split on ${best.feature} < ${best.value.toFixed(2)} (gini=${best.gini.toFixed(3)}) → ${best.left.length} left, ${best.right.length} right`
        })

        const leftBounds = { ...bounds }
        const rightBounds = { ...bounds }
        if (best.feature === 'x') {
            leftBounds.xMax = best.value
            rightBounds.xMin = best.value
        } else {
            leftBounds.yMax = best.value
            rightBounds.yMin = best.value
        }

        recurse(best.left, depth + 1, id, 'left', leftBounds)
        recurse(best.right, depth + 1, id, 'right', rightBounds)
    }

    const xMin = Math.min(...data.map(p => p.x)) - 0.5
    const xMax = Math.max(...data.map(p => p.x)) + 0.5
    const yMin = Math.min(...data.map(p => p.y)) - 0.5
    const yMax = Math.max(...data.map(p => p.y)) + 0.5

    recurse(data, 0, null, null, { xMin, xMax, yMin, yMax })

    steps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        splits: [...splits],
        activeNode: null,
        phase: 'done',
        depth: 0,
        message: `✓ Tree complete — ${Object.keys(tree).length} nodes, ${Object.values(tree).filter(n => n.leaf).length} leaves`
    })

    return { steps, bounds: { xMin, xMax, yMin, yMax } }
}

export default function DecisionTreeVisualizer() {
    const [points, setPoints] = useState(() => generateData())
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState(SPEED_PRESETS.slow)
    const [isPaused, setIsPaused] = useState(false)
    const [maxDepth, setMaxDepth] = useState(4)
    const [dataBounds, setDataBounds] = useState({ xMin: 0, xMax: 5, yMin: 0, yMax: 5 })
    const canvasRef = useRef(null)
    const PAD = 36

    const toX = x => PAD + ((x - dataBounds.xMin) / (dataBounds.xMax - dataBounds.xMin)) * (W - 2 * PAD)
    const toY = y => H - PAD - ((y - dataBounds.yMin) / (dataBounds.yMax - dataBounds.yMin)) * (H - 2 * PAD)

    const startTree = () => {
        const { steps: s, bounds } = buildTreeSteps(points, maxDepth)
        setDataBounds(bounds)
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

    const step = steps[currentStep] || { tree: {}, splits: [], activeNode: null, phase: 'idle', depth: 0, message: '' }

    // ── Canvas Rendering ──
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        canvas.width = W * dpr; canvas.height = H * dpr
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, W, H)

        ctx.fillStyle = '#fafaf8'
        ctx.fillRect(0, 0, W, H)

        // Leaf region shading
        if (currentStep >= 0) {
            Object.values(step.tree).forEach(node => {
                if (!node.leaf || !node.bounds) return
                const x1 = toX(node.bounds.xMin)
                const x2 = toX(node.bounds.xMax)
                const y1 = toY(node.bounds.yMax) // canvas Y is inverted
                const y2 = toY(node.bounds.yMin)
                ctx.fillStyle = CLASS_BG[node.prediction] || 'rgba(0,0,0,0.03)'
                ctx.fillRect(x1, y1, x2 - x1, y2 - y1)
            })
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

        // Axis labels
        ctx.fillStyle = '#666'
        ctx.font = 'bold 10px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.fillText('Feature X', W / 2, H - 4)
        ctx.save()
        ctx.translate(10, H / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText('Feature Y', 0, 0)
        ctx.restore()

        // Split lines with depth-based styling
        if (currentStep >= 0) {
            step.splits.forEach((s, idx) => {
                const depthColors = ['#0a0a0a', '#e63312', '#2563eb', '#16a34a', '#9333ea']
                const color = depthColors[s.depth % depthColors.length]
                const lineWidth = Math.max(1, 3 - s.depth * 0.5)

                ctx.strokeStyle = color
                ctx.lineWidth = lineWidth
                ctx.setLineDash(s.depth > 0 ? [6, 3] : [])

                const b = s.bounds
                if (s.feature === 'x') {
                    const sx = toX(s.value)
                    const sy1 = toY(b.yMax)
                    const sy2 = toY(b.yMin)
                    ctx.beginPath(); ctx.moveTo(sx, sy1); ctx.lineTo(sx, sy2); ctx.stroke()

                    // Label
                    ctx.fillStyle = color
                    ctx.font = `bold ${10 - s.depth}px JetBrains Mono`
                    ctx.textAlign = 'center'
                    ctx.setLineDash([])
                    ctx.fillText(`x<${s.value.toFixed(1)}`, sx, sy1 - 4)
                } else {
                    const sy = toY(s.value)
                    const sx1 = toX(b.xMin)
                    const sx2 = toX(b.xMax)
                    ctx.beginPath(); ctx.moveTo(sx1, sy); ctx.lineTo(sx2, sy); ctx.stroke()

                    ctx.fillStyle = color
                    ctx.font = `bold ${10 - s.depth}px JetBrains Mono`
                    ctx.textAlign = 'left'
                    ctx.setLineDash([])
                    ctx.fillText(`y<${s.value.toFixed(1)}`, sx2 + 4, sy + 4)
                }

                ctx.setLineDash([])
            })
        }

        // Data points
        points.forEach(p => {
            const px = toX(p.x), py = toY(p.y)
            const color = CLASS_COLORS[p.label]

            // Glow
            const glow = ctx.createRadialGradient(px, py, 0, px, py, 10)
            glow.addColorStop(0, `${color}33`)
            glow.addColorStop(1, `${color}00`)
            ctx.fillStyle = glow
            ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill()

            // Point shape varies by class
            ctx.fillStyle = color
            if (p.label === 0) {
                ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fill()
            } else if (p.label === 1) {
                ctx.beginPath()
                ctx.moveTo(px, py - 5.5); ctx.lineTo(px + 5.5, py)
                ctx.lineTo(px, py + 5.5); ctx.lineTo(px - 5.5, py); ctx.closePath()
                ctx.fill()
            } else {
                // Triangle
                ctx.beginPath()
                ctx.moveTo(px, py - 6); ctx.lineTo(px + 5, py + 4)
                ctx.lineTo(px - 5, py + 4); ctx.closePath()
                ctx.fill()
            }

            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.2
            if (p.label === 0) {
                ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.stroke()
            } else if (p.label === 1) {
                ctx.beginPath()
                ctx.moveTo(px, py - 5.5); ctx.lineTo(px + 5.5, py)
                ctx.lineTo(px, py + 5.5); ctx.lineTo(px - 5.5, py); ctx.closePath()
                ctx.stroke()
            } else {
                ctx.beginPath()
                ctx.moveTo(px, py - 6); ctx.lineTo(px + 5, py + 4)
                ctx.lineTo(px - 5, py + 4); ctx.closePath()
                ctx.stroke()
            }
        })
    }, [currentStep, points, step, dataBounds])

    const isFinalStep = currentStep === steps.length - 1 && !running

    // Build mini tree view
    const treeNodes = Object.values(step.tree)
    const maxTreeDepth = treeNodes.length > 0 ? Math.max(...treeNodes.map(n => n.depth)) : 0

    const labelStyle = {
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600, fontSize: '12px',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        color: COLORS.fgMuted
    }

    return (
        <PageContainer title="Decision Tree Classifier">
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is a Decision Tree?</h3>
                        <p>
                            A Decision Tree is a <strong>supervised learning</strong> algorithm that creates a
                            tree-like model of decisions by recursively <strong>partitioning the feature space</strong>.
                            At each internal node, it selects the feature and threshold that best separates the
                            classes, measured by the <strong>Gini impurity</strong> criterion.
                        </p>
                        <p style={{ marginTop: 8 }}>
                            This visualization shows a 2D classification problem with 3 classes. Watch as the tree
                            recursively splits the feature space with <strong>axis-aligned boundaries</strong>,
                            creating rectangular decision regions. Each split is color-coded by depth — deeper
                            splits use thinner, dashed lines.
                        </p>
                        <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
                        <ol style={{ paddingLeft: 20, margin: 0 }}>
                            <li>Start with all data at the root node</li>
                            <li>Find the feature and threshold that minimizes Gini impurity</li>
                            <li>Split the data into left (feature &lt; threshold) and right branches</li>
                            <li>Recursively apply to each branch until stopping criteria are met</li>
                            <li>Assign the majority class as the leaf prediction</li>
                        </ol>
                        <h4 style={{ margin: '16px 0 8px' }}>Gini Impurity</h4>
                        <p>
                            Gini = 1 − Σ(p<sub>i</sub>²) measures how "impure" a node is. A Gini of 0 means
                            all samples belong to one class (pure). The best split minimizes the weighted Gini
                            across both child nodes.
                        </p>
                        <h4 style={{ margin: '16px 0 8px' }}>Key Characteristics</h4>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li><strong>Non-parametric:</strong> Makes no assumptions about data distribution</li>
                            <li><strong>Interpretable:</strong> Decisions can be traced through the tree</li>
                            <li><strong>Prone to overfitting:</strong> Can memorize noise without pruning/depth limits</li>
                            <li><strong>Axis-aligned:</strong> Splits are perpendicular to feature axes</li>
                        </ul>
                        <p style={{ marginTop: 12 }}>
                            <strong>Time Complexity:</strong> O(n · features · n·log(n)) per split
                        </p>
                        <p style={{ marginTop: 4 }}>
                            <strong>Space Complexity:</strong> O(tree depth) for recursion stack
                        </p>
                        <p style={{ marginTop: 12, color: COLORS.fgMuted, fontSize: '0.9em' }}>
                            <strong>Real-world uses:</strong> Medical diagnosis, fraud detection, customer segmentation,
                            and forms the basis of Random Forests and Gradient Boosted Trees (XGBoost, LightGBM).
                        </p>
                    </ExplanationBox>

                    <CodeBlock code={dtPythonCode} onCopy={() => { }} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {/* Config */}
                        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <label style={labelStyle}>Max Depth</label>
                                <select
                                    value={maxDepth}
                                    onChange={e => { setMaxDepth(Number(e.target.value)); reset() }}
                                    disabled={running}
                                    style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: 13, padding: '4px 8px',
                                        border: `1px solid ${COLORS.border}`,
                                        borderRadius: '0px', background: COLORS.surface, cursor: 'pointer'
                                    }}
                                >
                                    {[2, 3, 4, 5, 6].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Status Message */}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={step.phase === 'done' ? 'success' : step.phase === 'split' ? 'compare' : 'info'}
                                />
                            )}
                        </AnimatePresence>

                        {/* Feature space scatter */}
                        <div style={{
                            margin: '12px auto', border: `1px solid ${COLORS.border}`,
                            borderRadius: '2px', overflow: 'hidden', width: W
                        }}>
                            <canvas ref={canvasRef} style={{ width: W, height: H, display: 'block' }} />
                        </div>

                        {/* Mini tree diagram */}
                        {treeNodes.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{
                                    margin: '12px 0', padding: '12px',
                                    background: COLORS.surface,
                                    border: `1px solid ${COLORS.border}`,
                                    overflow: 'auto', maxHeight: 200
                                }}
                            >
                                <div style={{
                                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                                    fontWeight: 600, textTransform: 'uppercase',
                                    letterSpacing: '0.05em', color: COLORS.fgMuted, marginBottom: 8
                                }}>
                                    Tree Structure
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {treeNodes.map(node => (
                                        <motion.div
                                            key={node.id}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{
                                                opacity: 1, x: 0,
                                                backgroundColor: node.id === step.activeNode
                                                    ? 'rgba(230, 51, 18, 0.1)' : 'transparent'
                                            }}
                                            transition={{ duration: 0.2 }}
                                            style={{
                                                paddingLeft: node.depth * 18 + 4,
                                                padding: `2px 6px 2px ${node.depth * 18 + 6}px`,
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: 10,
                                                color: COLORS.fg,
                                                borderRadius: '2px',
                                                borderLeft: node.id === step.activeNode
                                                    ? '2px solid #e63312' : '2px solid transparent'
                                            }}
                                        >
                                            {node.leaf ? (
                                                <span>
                                                    <span style={{ color: CLASS_COLORS[node.prediction] }}>■</span>
                                                    {' '}Leaf → class {node.prediction} ({node.count} pts)
                                                </span>
                                            ) : (
                                                <span>
                                                    ├ {node.feature} &lt; {node.value.toFixed(2)}{' '}
                                                    <span style={{ color: COLORS.fgMuted }}>
                                                        gini={node.gini.toFixed(3)}
                                                    </span>
                                                </span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Legend */}
                        <div style={{
                            display: 'flex', gap: 16, justifyContent: 'center', margin: '8px 0',
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                            textTransform: 'uppercase', letterSpacing: '0.04em', color: COLORS.fgMuted
                        }}>
                            {['Class 0 ●', 'Class 1 ◆', 'Class 2 ▲'].map((label, i) => (
                                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <span style={{
                                        width: 10, height: 10,
                                        backgroundColor: CLASS_COLORS[i],
                                        borderRadius: i === 0 ? '50%' : i === 1 ? '0' : '0',
                                        transform: i === 1 ? 'rotate(45deg)' : 'none',
                                        display: 'inline-block'
                                    }} />
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* Controls */}
                        <ControlsRow>
                            <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

                            {running && <StepCounter current={currentStep + 1} total={steps.length} />}

                            <ControlButton onClick={startTree} disabled={running && !isPaused} variant="primary">
                                {running ? 'Building…' : 'Build Tree'}
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
                                    ✓ {Object.keys(step.tree).length} nodes, {Object.values(step.tree).filter(n => n.leaf).length} leaves, max depth {maxDepth}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
