import React from 'react';
import { Target, Calendar, CheckCircle2, Clock, Play } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { useStudyData } from '../../context/StudyDataContext';

export default function GoalDetailModal({
  goal,
  isOpen,
  onClose,
  onEdit,
  onStartFocusWithGoal,
}) {
  const { subjects, sessions, updateGoal, deleteGoal } = useStudyData();

  if (!goal) return null;

  const subject = subjects.find((s) => s.id === goal.subjectId);
  const percent = Math.min(100, Math.round((goal.currentProgress / goal.targetValue) * 100)) || 0;
  const remainingWork = Math.max(0, goal.targetValue - goal.currentProgress);

  // Calculate days remaining to deadline
  let daysRemaining = 0;
  if (goal.deadline) {
    const diffTime = new Date(goal.deadline) - new Date();
    daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const dailyTargetPace = daysRemaining > 0 ? (remainingWork / daysRemaining).toFixed(1) : remainingWork;
  const weeklyTargetPace = daysRemaining > 0 ? (remainingWork / (daysRemaining / 7)).toFixed(1) : remainingWork;

  // Filter study sessions associated with this goal
  const goalSessions = sessions.filter((s) => s.goalId === goal.id && s.status === 'completed');

  const handleMarkCompleted = () => {
    updateGoal(goal.id, { status: 'completed', currentProgress: goal.targetValue });
    onClose();
  };

  const handleDelete = () => {
    deleteGoal(goal.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Goal Details" maxWidth="max-w-xl">
      <div className="space-y-5">
        {/* Title Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: subject?.color || '#3B82F6' }}
              />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {subject?.name || 'General'}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{goal.title}</h3>
            {goal.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{goal.description}</p>
            )}
          </div>
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              goal.status === 'completed'
                ? 'bg-emerald-100 text-emerald-700'
                : goal.status === 'paused'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {goal.status}
          </span>
        </div>

        {/* Progress Bar & Numerical Metrics */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <ProgressBar progress={goal.currentProgress} max={goal.targetValue} height="h-3" />
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold">Completed</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {goal.currentProgress} {goal.unit}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold">Remaining</p>
              <p className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                {remainingWork} {goal.unit}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold">Target</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {goal.targetValue} {goal.unit}
              </p>
            </div>
          </div>
        </div>

        {/* Pace & Deadline breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Target Deadline</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {goal.deadline || 'No deadline'} ({daysRemaining} days left)
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Recommended Pace</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {dailyTargetPace} {goal.unit}/day
            </p>
          </div>
        </div>

        {/* Associated Sessions */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Related Study Sessions ({goalSessions.length})
          </h4>
          {goalSessions.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No completed sessions linked yet.</p>
          ) : (
            <div className="max-h-36 overflow-y-auto space-y-2">
              {goalSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {new Date(s.completedAt || s.startedAt).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    +{s.durationMinutes} mins
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onStartFocusWithGoal(goal);
            }}
            icon={Play}
          >
            Start Focus
          </Button>

          {goal.status !== 'completed' && (
            <Button variant="secondary" onClick={handleMarkCompleted} icon={CheckCircle2}>
              Mark Completed
            </Button>
          )}

          <Button variant="outline" onClick={() => onEdit(goal)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
