import React from 'react';
import { formatTimecode, formatSeconds, calculateTotalFrames } from '../../utils/timecode';

interface TimelineBarProps {
  currentTime: number;
  duration: number;
  fps: number;
  isPlaying: boolean;
  isLooping: boolean;
  onTogglePlay: () => void;
  onSeekTime: (time: number) => void;
  onStepFrame: (direction: -1 | 1) => void;
  onToggleLoop: () => void;
  onJumpToStart: () => void;
  onJumpToEnd: () => void;
}

export const TimelineBar: React.FC<TimelineBarProps> = ({
  currentTime,
  duration,
  fps,
  isPlaying,
  isLooping,
  onTogglePlay,
  onSeekTime,
  onStepFrame,
  onToggleLoop,
  onJumpToStart,
  onJumpToEnd
}) => {
  const currentFrame = Math.floor(currentTime * fps);
  const totalFrames = calculateTotalFrames(fps, duration);
  const progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  return (
    <div className="timeline-bar">
      <div className="timeline-controls-left">
        <button
          type="button"
          className="btn-transport"
          onClick={onJumpToStart}
          title="Jump to Start (0s)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="19 20 9 12 19 4 19 20"/>
            <line x1="5" y1="19" x2="5" y2="5"/>
          </svg>
        </button>

        <button
          type="button"
          className="btn-transport"
          onClick={() => onStepFrame(-1)}
          title="Step 1 Frame Back (←)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="15 18 9 12 15 6 15 18"/>
          </svg>
        </button>

        <button
          type="button"
          className={`btn-play-pause ${isPlaying ? 'is-playing' : ''}`}
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4"/>
            </svg>
          )}
        </button>

        <button
          type="button"
          className="btn-transport"
          onClick={() => onStepFrame(1)}
          title="Step 1 Frame Forward (→)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="9 18 15 12 9 6 9 18"/>
          </svg>
        </button>

        <button
          type="button"
          className="btn-transport"
          onClick={onJumpToEnd}
          title="Jump to End"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 4 15 12 5 20 5 4"/>
            <line x1="19" y1="5" x2="19" y2="19"/>
          </svg>
        </button>

        <button
          type="button"
          className={`btn-transport btn-loop ${isLooping ? 'active' : ''}`}
          onClick={onToggleLoop}
          title="Toggle Repeat Loop"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        </button>
      </div>

      <div className="timeline-scrubber-center">
        <div className="timeline-track-wrapper">
          <input
            type="range"
            min="0"
            max={duration}
            step={1 / fps}
            value={currentTime}
            onChange={(e) => onSeekTime(Number(e.target.value))}
            className="timeline-slider"
          />
          <div className="timeline-progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="timeline-info-right">
        <div className="timecode-display" title="SMPTE Timecode (HH:MM:SS:FF)">
          {formatTimecode(currentTime, fps)}
        </div>
        <div className="time-sub-display">
          <span className="current-sec">{formatSeconds(currentTime)}</span>
          <span className="total-sec">/ {formatSeconds(duration)}</span>
        </div>
        <div className="frame-counter-badge">
          F {currentFrame} / {totalFrames}
        </div>
      </div>
    </div>
  );
};
