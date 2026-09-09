import React from 'react';

export default function Heatmap({ heatmapData = [], minStreakMinutes = 25 }) {
  // Intensity color map for pristine light mode and dark mode
  const getIntensityClass = (intensity) => {
    switch (intensity) {
      case 4:
        return 'bg-emerald-600 dark:bg-emerald-500 text-white'; // 75m+
      case 3:
        return 'bg-emerald-400 dark:bg-emerald-600 text-white'; // 50m-74m
      case 2:
        return 'bg-emerald-300 dark:bg-emerald-700 text-emerald-950'; // 25m-49m (meets streak minimum)
      case 1:
        return 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800'; // 1-24m (study logged but under threshold)
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-400'; // 0 mins
    }
  };

  // Group heatmap entries into 7-day columns (weeks)
  const weeks = [];
  let currentWeek = [];

  heatmapData.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === heatmapData.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="inline-block min-w-full">
        <div className="flex items-end gap-1 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="w-4"></div>
          {weeks.map((week, idx) => {
            // Show month label roughly every 4 weeks
            const firstDay = week[0]?.date;
            const monthLabel = firstDay && idx % 4 === 0 ? new Date(firstDay).toLocaleDateString('en-US', { month: 'short' }) : '';
            return (
              <div key={idx} className="w-3 text-center truncate">
                {monthLabel}
              </div>
            );
          })}
        </div>

        <div className="flex gap-1">
          {/* Day of week labels column */}
          <div className="flex flex-col justify-between text-[9px] font-semibold text-slate-400 py-0.5">
            {daysOfWeek.map((d, i) => (
              <span key={i} className="h-3 flex items-center">{d}</span>
            ))}
          </div>

          {/* Grid of week columns */}
          <div className="flex gap-1">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) => (
                  <div
                    key={day.date || dayIdx}
                    className={`w-3 h-3 rounded-sm ${getIntensityClass(day.intensity)} transition-all hover:scale-125 cursor-pointer relative group`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 whitespace-nowrap bg-slate-900 text-white text-[11px] font-medium py-1 px-2 rounded shadow-lg pointer-events-none">
                      {day.date}: {day.minutes} mins {day.qualifies ? '🔥 (Streak)' : ''}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center justify-end space-x-2 mt-3 text-xs text-slate-500 font-medium">
          <span>Less</span>
          <div className="flex space-x-1 items-center">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 dark:bg-emerald-950" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-700" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
          </div>
          <span>More ({minStreakMinutes}+ min threshold)</span>
        </div>
      </div>
    </div>
  );
}
