import React, { useState } from 'react';
import { Clock } from 'lucide-react';

export default function PresetSelector({
  selectedPreset,
  onSelectPreset,
  customMinutes,
  onCustomMinutesChange,
  disabled = false,
}) {
  const presets = [
    { id: '25/5', focusMins: 25, breakMins: 5, label: '25 / 5', desc: 'Standard Pomodoro' },
    { id: '50/10', focusMins: 50, breakMins: 10, label: '50 / 10', desc: 'Extended Focus' },
    { id: '90/20', focusMins: 90, breakMins: 20, label: '90 / 20', desc: 'Deep Work' },
    { id: 'custom', focusMins: customMinutes || 25, breakMins: 5, label: 'Custom', desc: 'Set duration' },
  ];

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-center">
        Timer Presets
      </p>
      <div className="grid grid-cols-4 gap-2">
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          return (
            <button
              key={preset.id}
              disabled={disabled}
              onClick={() => onSelectPreset(preset)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950 dark:border-blue-500 dark:text-blue-300 font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 font-medium'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <p className="text-sm">{preset.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{preset.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Custom Duration Input */}
      {selectedPreset === 'custom' && (
        <div className="mt-3 flex items-center justify-center space-x-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Custom Focus Minutes:</span>
          <input
            type="number"
            min="1"
            max="180"
            disabled={disabled}
            value={customMinutes}
            onChange={(e) => onCustomMinutesChange(Number(e.target.value))}
            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-700 rounded-lg text-center font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}
