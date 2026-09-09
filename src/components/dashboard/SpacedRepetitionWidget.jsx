import React from 'react';
import { Brain, Sparkles, Clock, Calendar } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useStudyData } from '../../context/StudyDataContext';

export default function SpacedRepetitionWidget({ setActivePage }) {
  const { flashcards, dueFlashcards } = useStudyData();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const dueTodayCount = dueFlashcards.length;

  const dueTomorrowCount = flashcards.filter(
    (c) => c.nextReviewDate === tomorrowStr
  ).length;

  const upcomingCount = flashcards.filter(
    (c) => c.nextReviewDate && c.nextReviewDate > tomorrowStr
  ).length;

  return (
    <Card className="flex flex-col justify-between h-full bg-gradient-to-br from-purple-50/50 via-white to-pink-50/20 dark:from-slate-900 dark:to-purple-950/30 border-purple-100 dark:border-purple-900/40">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/60 dark:text-purple-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Spaced Repetition</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Memory retention system</p>
            </div>
          </div>
          {dueTodayCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              {dueTodayCount} Due
            </span>
          )}
        </div>

        {/* Due Banner */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/50 my-2 text-center">
          <p className="text-3xl font-extrabold text-purple-900 dark:text-purple-200 tracking-tight">
            {dueTodayCount}
          </p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {dueTodayCount === 1 ? 'flashcard' : 'flashcards'} due for review today
          </p>
        </div>

        {/* Schedule Breakdown */}
        <div className="grid grid-cols-3 gap-2 my-3 text-center">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80">
            <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-500 mb-0.5">
              <Clock className="w-3 h-3 text-purple-500" />
              <span>Today</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{dueTodayCount}</p>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80">
            <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-500 mb-0.5">
              <Calendar className="w-3 h-3 text-blue-500" />
              <span>Tomorrow</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{dueTomorrowCount}</p>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80">
            <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-500 mb-0.5">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Upcoming</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{upcomingCount}</p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        variant="primary"
        className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
        onClick={() => setActivePage('flashcards')}
        icon={Brain}
      >
        {dueTodayCount > 0 ? 'Review Now' : 'Manage Flashcards'}
      </Button>
    </Card>
  );
}
