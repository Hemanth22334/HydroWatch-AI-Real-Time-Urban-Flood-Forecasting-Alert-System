import React, { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import SubjectCard from '../components/subjects/SubjectCard';
import SubjectModal from '../components/subjects/SubjectModal';
import Button from '../components/common/Button';
import { useStudyData } from '../context/StudyDataContext';

export default function SubjectsPage({ setActivePage, onStartFocusWithSubject }) {
  const { subjects, sessions, goals, deleteSubject } = useStudyData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const getSubjectStats = (subjectId) => {
    const subjSessions = sessions.filter(
      (s) => s.subjectId === subjectId && s.status === 'completed'
    );

    const totalMins = subjSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const sessionsCount = subjSessions.length;

    const activeGoal = goals.find(
      (g) => g.subjectId === subjectId && g.status === 'active'
    );

    const lastSession = subjSessions.sort(
      (a, b) => (b.completedAt || b.startedAt) - (a.completedAt || a.startedAt)
    )[0];

    const lastStudiedDate = lastSession ? lastSession.completedAt || lastSession.startedAt : null;

    return {
      totalMins,
      sessionsCount,
      activeGoal,
      lastStudiedDate,
    };
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Technical Subjects
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage subject tracking, focus distribution, and goals
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingSubject(null);
            setIsModalOpen(true);
          }}
          icon={Plus}
          className="shadow-md shadow-blue-500/20"
        >
          Add Custom Subject
        </Button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const stats = getSubjectStats(subject.id);
          return (
            <SubjectCard
              key={subject.id}
              subject={subject}
              subjectMins={stats.totalMins}
              subjectSessionsCount={stats.sessionsCount}
              activeGoal={stats.activeGoal}
              lastStudiedDate={stats.lastStudiedDate}
              onEdit={(s) => {
                setEditingSubject(s);
                setIsModalOpen(true);
              }}
              onDelete={(id) => deleteSubject(id)}
              onStartFocus={(sId) => {
                if (onStartFocusWithSubject) onStartFocusWithSubject(sId);
                else setActivePage('focus');
              }}
            />
          );
        })}
      </div>

      {/* Subject Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingSubject={editingSubject}
      />
    </div>
  );
}
