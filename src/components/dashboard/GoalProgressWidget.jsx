import React from 'react';
import { Target, ChevronRight, Plus } from 'lucide-react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import { useStudyData } from '../../context/StudyDataContext';

export default function GoalProgressWidget({ setActivePage, onSelectGoal }) {
  const { goals, subjects } = useStudyData();

  const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 4);

  const getSubjectName = (subjectId) => {
    const s = subjects.find((sub) => sub.id === subjectId);
    return s ? s.name : 'General';
  };

  const getSubjectColor = (subjectId) => {
    const s = subjects.find((sub) => sub.id === subjectId);
    return s?.color || '#3B82F6';
  };

  return (
    <Card className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Study Goal Progress</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activeGoals.length} active goals</p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('goals')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeGoals.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-2">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No active goals yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-3">Set study targets to track progress</p>
            <button
              onClick={() => setActivePage('goals')}
              className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create goal</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 my-2">
            {activeGoals.map((goal) => {
              const subjName = getSubjectName(goal.subjectId);
              const subjColor = getSubjectColor(goal.subjectId);
              const percent = Math.min(100, Math.round((goal.currentProgress / goal.targetValue) * 100)) || 0;

              return (
                <div
                  key={goal.id}
                  onClick={() => onSelectGoal && onSelectGoal(goal)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: subjColor }}
                      />
                      <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {goal.title}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex-shrink-0 ml-2">
                      {goal.currentProgress}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  <ProgressBar
                    progress={goal.currentProgress}
                    max={goal.targetValue}
                    showLabel={false}
                    height="h-2"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
                    <span>{subjName}</span>
                    <span>{percent}% complete</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          onClick={() => setActivePage('goals')}
          className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 py-1"
        >
          Manage Goals →
        </button>
      </div>
    </Card>
  );
}
