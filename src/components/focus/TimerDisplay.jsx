import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function TimerDisplay({
  secondsLeft,
  totalSeconds,
  sessionType = 'focus',
  subjectName = '',
  subjectColor = '#3B82F6',
  goalTitle = '',
  isRunning = false,
}) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  // SVG ring circumference math
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const sessionBadge = {
    focus: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    shortBreak: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    longBreak: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  };

  const sessionLabels = {
    focus: '🧠 Deep Focus Session',
    shortBreak: '☕ Short Break',
    longBreak: '🌴 Long Break',
  };

  return (
    <div className="flex flex-col items-center justify-center my-6">
      {/* Session Type Pill */}
      <span className={`text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border mb-4 shadow-2xs ${sessionBadge[sessionType]}`}>
        {sessionLabels[sessionType]}
      </span>

      {/* Circular SVG Timer Ring */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx="144"
            cy="144"
            r={radius}
            className="text-slate-100 dark:text-slate-800 stroke-current"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated progress ring */}
          <circle
            cx="144"
            cy="144"
            r={radius}
            stroke={subjectColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300 ease-linear"
          />
        </svg>

        {/* Inner Timer Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <p className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
            {formattedTime}
          </p>

          {subjectName && (
            <div className="flex items-center space-x-1.5 mt-3 max-w-[200px] truncate">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: subjectColor }} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                {subjectName}
              </span>
            </div>
          )}

          {goalTitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[180px]">
              🎯 {goalTitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
