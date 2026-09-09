import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Square } from 'lucide-react';
import Button from '../common/Button';

export default function TimerControls({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkipBreak,
  onStop,
  sessionType = 'focus',
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 my-4">
      {!isRunning && !isPaused && (
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          icon={Play}
          className="px-8 shadow-lg shadow-blue-500/25 text-base"
        >
          Start Focus
        </Button>
      )}

      {isRunning && (
        <Button
          variant="secondary"
          size="lg"
          onClick={onPause}
          icon={Pause}
          className="px-6 text-base"
        >
          Pause
        </Button>
      )}

      {isPaused && (
        <Button
          variant="primary"
          size="lg"
          onClick={onResume}
          icon={Play}
          className="px-6 shadow-md shadow-blue-500/20 text-base"
        >
          Resume
        </Button>
      )}

      {(isRunning || isPaused) && (
        <>
          <Button
            variant="outline"
            size="md"
            onClick={onReset}
            icon={RotateCcw}
            title="Reset timer"
          >
            Reset
          </Button>

          <Button
            variant="danger"
            size="md"
            onClick={onStop}
            icon={Square}
            title="Stop session"
          >
            Stop
          </Button>
        </>
      )}

      {sessionType !== 'focus' && (
        <Button
          variant="outline"
          size="md"
          onClick={onSkipBreak}
          icon={SkipForward}
        >
          Skip Break
        </Button>
      )}
    </div>
  );
}
