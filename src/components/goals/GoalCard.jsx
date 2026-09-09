import React from 'react';
import { Target, Calendar, CheckCircle2, PauseCircle, PlayCircle, Trash2, Edit3 } from 'lucide-react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';

export default function GoalCard({
  goal,
  subject,
  onEdit,
  onToggleStatus,
  onDelete,
  onSelect,
}) {
  const percent = Math.min(100, Math.round((goal.currentProgress / goal.targetValue) * 100)) || 0;

  const priorityBadge = {
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200',
  };

  const statusBadge = {
    active: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    paused: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  };

  return (
    <Card className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: subject?.color || '#3B82F6' }}
            />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {subject?.name || 'General Subject'}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityBadge[goal.priority] || priorityBadge.medium}`}>
              {goal.priority}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusBadge[goal.status]}`}>
              {goal.status}
            </span>
          </div>
        </div>

        <h3
          onClick={() => onSelect(goal)}
          className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors line-clamp-1 mb-1"
        >
          {goal.title}
        </h3>

        {goal.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
            {goal.description}
          </p>
        )}

        <div className="my-3">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            <span>Progress</span>
            <span>
              {goal.currentProgress} / {goal.targetValue} {goal.unit} ({percent}%)
            </span>
          </div>
          <ProgressBar progress={goal.currentProgress} max={goal.targetValue} showLabel={false} height="h-2.5" />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{goal.deadline ? `Due ${goal.deadline}` : 'No deadline'}</span>
        </div>

        <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleStatus(goal)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={goal.status === 'active' ? 'Pause Goal' : 'Activate Goal'}
          >
            {goal.status === 'active' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Goal"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
