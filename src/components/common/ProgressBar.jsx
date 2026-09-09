import React from 'react';

export default function ProgressBar({
  progress = 0,
  max = 100,
  colorClass = 'bg-blue-600',
  showLabel = true,
  height = 'h-2.5',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((progress / max) * 100))) || 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
