import { SPEED_PRESETS, type SpeedKey } from '../../utils/animationConfig'

interface SpeedControlProps {
    speed: SpeedKey
    onSpeedChange: (speed: SpeedKey) => void
    disabled?: boolean
}

export function SpeedControl({ speed, onSpeedChange, disabled }: SpeedControlProps) {
    return (
        <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
                Speed
            </span>
            <select
                value={speed}
                onChange={e => onSpeedChange(e.target.value as SpeedKey)}
                disabled={disabled}
                className="font-mono text-xs font-medium px-3 py-2 bg-[var(--surface)] text-[var(--fg)] border border-[var(--border)] cursor-pointer hover:border-[var(--border-strong)] transition-colors focus:outline-none focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {Object.keys(SPEED_PRESETS).map(key => (
                    <option key={key} value={key}>{key}</option>
                ))}
            </select>
        </div>
    )
}
