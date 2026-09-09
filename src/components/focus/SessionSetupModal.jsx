import React, { useState } from 'react';
import { Play, BookOpen, Target, Clock } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useStudyData } from '../../context/StudyDataContext';

export default function SessionSetupModal({
  isOpen,
  onClose,
  onStartSession,
  initialSubjectId = '',
  initialGoalId = '',
}) {
  const { subjects, goals } = useStudyData();

  const [subjectId, setSubjectId] = useState(initialSubjectId || (subjects[0]?.id || ''));
  const [goalId, setGoalId] = useState(initialGoalId || '');
  const [durationMinutes, setDurationMinutes] = useState(25);

  const filteredGoals = goals.filter((g) => g.status === 'active' && (!subjectId || g.subjectId === subjectId));

  const handleStart = () => {
    onStartSession({
      subjectId,
      goalId,
      durationMinutes: Number(durationMinutes),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Focus Session">
      <div className="space-y-5">
        {/* Subject Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Select Subject
          </label>
          <select
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setGoalId('');
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Goal Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-500" />
            Link to Goal (Optional)
          </label>
          <select
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- No linked goal --</option>
            {filteredGoals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title} ({g.currentProgress}/{g.targetValue} {g.unit})
              </option>
            ))}
          </select>
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-500" />
            Session Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[15, 25, 50, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDurationMinutes(mins)}
                className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                  durationMinutes === mins
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-3">
          <Button variant="primary" size="lg" onClick={handleStart} icon={Play} className="w-full">
            START FOCUS
          </Button>
        </div>
      </div>
    </Modal>
  );
}
