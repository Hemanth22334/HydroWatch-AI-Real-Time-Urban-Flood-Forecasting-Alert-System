import React from 'react';
import { Flame, Clock, Target, ArrowRight } from 'lucide-react';
import TodayFocusWidget from '../components/dashboard/TodayFocusWidget';
import GoalProgressWidget from '../components/dashboard/GoalProgressWidget';
import SpacedRepetitionWidget from '../components/dashboard/SpacedRepetitionWidget';
import ActivityChartWidget from '../components/dashboard/ActivityChartWidget';
import DailyQuoteWidget from '../components/dashboard/DailyQuoteWidget';
import { useStudyData } from '../context/StudyDataContext';

export default function DashboardPage({ setActivePage, onSelectGoal }) {
  const { streakStats, analytics, goals, userSettings } = useStudyData();

  const activeGoalsCount = goals.filter((g) => g.status === 'active').length;
  const completedGoalsCount = goals.filter((g) => g.status === 'completed').length;
  const totalGoalsCount = goals.length;
  const overallGoalPercent = totalGoalsCount > 0 ? Math.round((completedGoalsCount / totalGoalsCount) * 100) : 0;

  const targetHours = ((userSettings.dailyTargetMinutes || 120) / 60).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Streak */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Streak</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              🔥 {streakStats.currentStreak} <span className="text-sm font-semibold text-slate-500">days</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Best: {streakStats.longestStreak} days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xl">
            🔥
          </div>
        </div>

        {/* Metric 2: Today's Study Time */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Time</p>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {analytics.todayFormatted}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Target: {targetHours}h per day</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Goal Progress */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Goal Completion</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {overallGoalPercent}% <span className="text-xs font-semibold text-slate-500">complete</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{completedGoalsCount} of {totalGoalsCount} goals done</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widget A: Today's Focus CTA */}
        <div className="md:col-span-1">
          <TodayFocusWidget setActivePage={setActivePage} />
        </div>

        {/* Widget B: Goal Progress */}
        <div className="md:col-span-1">
          <GoalProgressWidget setActivePage={setActivePage} onSelectGoal={onSelectGoal} />
        </div>

        {/* Widget C: Spaced Repetition Due */}
        <div className="md:col-span-1">
          <SpacedRepetitionWidget setActivePage={setActivePage} />
        </div>
      </div>

      {/* Analytics & Quote Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widget D: Weekly Study Activity Chart */}
        <div className="md:col-span-2">
          <ActivityChartWidget />
        </div>

        {/* Widget E: Daily Motivational Quote */}
        <div className="md:col-span-1">
          <DailyQuoteWidget />
        </div>
      </div>
    </div>
  );
}
