import React from 'react';
import { BookOpen, Clock, CheckCircle2, Calendar, Edit3, Trash2, Play } from 'lucide-react';
import Card from '../common/Card';
import { formatMinutesToHoursMins } from '../../utils/analyticsCalculator';

export default function SubjectCard({
  subject,
  subjectMins = 0,
  subjectSessionsCount = 0,
  activeGoal = null,
  lastStudiedDate = null,
  onEdit,
  onDelete,
  onStartFocus,
}) {
  const percent = activeGoal
    ? Math.min(100, Math.round((activeGoal.currentProgress / activeGoal.targetValue) * 100))
    : 0;

  return (
    <Card className="flex flex-col justify-between h-full group">
      <div>
        {/* Subject Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <span
              className="w-4 h-4 rounded-full flex-shrink-0 shadow-xs"
              style={{ backgroundColor: subject.color || '#3B82F6' }}
            />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate">
              {subject.name}
            </h3>
          </div>
          <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(subject)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Subject"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(subject.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Subject"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              Total Time
            </p>
            <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              {formatMinutesToHoursMins(subjectMins)}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Sessions
            </p>
            <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              {subjectSessionsCount} done
            </p>
          </div>
        </div>

        {/* Current Goal snippet */}
        {activeGoal ? (
          <div className="my-2 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-blue-50/40 dark:bg-blue-950/20">
            <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
              Current Goal
            </p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {activeGoal.title}
            </p>
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
              <span>{activeGoal.currentProgress}/{activeGoal.targetValue} {activeGoal.unit}</span>
              <span>{percent}%</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic my-2">No active goal for this subject</p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p className="text-[11px] text-slate-400">
          Last studied: {lastStudiedDate ? new Date(lastStudiedDate).toLocaleDateString() : 'Never'}
        </p>

        <button
          onClick={() => onStartFocus(subject.id)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 text-xs font-bold transition-colors"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Study</span>
        </button>
      </div>
    </Card>
  );
}
