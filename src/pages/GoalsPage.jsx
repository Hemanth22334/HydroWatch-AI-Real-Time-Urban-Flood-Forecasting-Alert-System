import React, { useState } from 'react';
import { Target, Plus, Filter } from 'lucide-react';
import GoalCard from '../components/goals/GoalCard';
import GoalModal from '../components/goals/GoalModal';
import GoalDetailModal from '../components/goals/GoalDetailModal';
import Button from '../components/common/Button';
import { useStudyData } from '../context/StudyDataContext';

export default function GoalsPage({ setActivePage, onStartFocusWithGoal }) {
  const { goals, subjects, updateGoal, deleteGoal } = useStudyData();

  const [filterStatus, setFilterStatus] = useState('active'); // 'all' | 'active' | 'paused' | 'completed'
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [detailGoal, setDetailGoal] = useState(null);

  const filteredGoals = goals.filter((g) => {
    const matchesStatus = filterStatus === 'all' || g.status === filterStatus;
    const matchesSubject = selectedSubjectId === 'all' || g.subjectId === selectedSubjectId;
    return matchesStatus && matchesSubject;
  });

  const getSubjectForGoal = (subjectId) => {
    return subjects.find((s) => s.id === subjectId);
  };

  const handleToggleStatus = (goal) => {
    const nextStatus = goal.status === 'active' ? 'paused' : 'active';
    updateGoal(goal.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Study Goals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Set, track, and achieve technical study milestones
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingGoal(null);
            setIsModalOpen(true);
          }}
          icon={Plus}
          className="shadow-md shadow-blue-500/20"
        >
          Create Goal
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-1">
          {['all', 'active', 'paused', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">No goals found</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            {goals.length === 0
              ? 'Create your first study goal to start tracking progress.'
              : 'Try clearing filter criteria to see your goals.'}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setEditingGoal(null);
              setIsModalOpen(true);
            }}
            icon={Plus}
          >
            Create Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              subject={getSubjectForGoal(goal.subjectId)}
              onEdit={(g) => {
                setEditingGoal(g);
                setIsModalOpen(true);
              }}
              onToggleStatus={handleToggleStatus}
              onDelete={(id) => deleteGoal(id)}
              onSelect={(g) => setDetailGoal(g)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingGoal={editingGoal}
      />

      <GoalDetailModal
        goal={detailGoal}
        isOpen={!!detailGoal}
        onClose={() => setDetailGoal(null)}
        onEdit={(g) => {
          setDetailGoal(null);
          setEditingGoal(g);
          setIsModalOpen(true);
        }}
        onStartFocusWithGoal={(g) => {
          if (onStartFocusWithGoal) onStartFocusWithGoal(g);
          else setActivePage('focus');
        }}
      />
    </div>
  );
}
