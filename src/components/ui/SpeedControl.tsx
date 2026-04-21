import { SPEED_PRESETS, type SpeedKey } from '../../utils/animationConfig';

interface SpeedControlProps {
  speed: SpeedKey;
  onSpeedChange: (speed: SpeedKey) => void;
  disabled?: boolean;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

export function SpeedControl({
  speed,
  onSpeedChange,
  disabled,
  isPaused,
  onTogglePause,
}: SpeedControlProps) {
  return (
    <div className="flex items-center gap-2.5">
      {onTogglePause && (
        <button
          onClick={onTogglePause}
          className="p-1 px-2 border border-[var(--border)] hover:bg-[var(--surface-hover)] rounded transition-colors text-[var(--fg)]"
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          )}
        </button>
      )}
      <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
        Speed
      </span>
      <select
        value={speed}
        onChange={(e) => onSpeedChange(e.target.value as SpeedKey)}
        disabled={disabled}
        className="font-mono text-xs font-medium px-3 py-2 bg-[var(--surface)] text-[var(--fg)] border border-[var(--border)] cursor-pointer hover:border-[var(--border-strong)] transition-colors focus:outline-none focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {Object.keys(SPEED_PRESETS).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}
