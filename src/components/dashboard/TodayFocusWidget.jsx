import React from 'react';
import { Timer, Play, CheckCircle2, Clock } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useStudyData } from '../../context/StudyDataContext';

export default function TodayFocusWidget({ setActivePage }) {
  const { analytics, userSettings, sessions } = useStudyData();

  const todaySessions = sessions.filter(
    (s) =>
      s.status === 'completed' &&
      new Date(s.completedAt || s.startedAt).toDateString() === new Date().toDateString()
  );

  const completedCount = todaySessions.length;
  const todayMinutes = analytics.todayMinutes || 0;
  const targetMinutes = userSettings.dailyTargetMinutes || 120;
  const targetHours = (targetMinutes / 60).toFixed(1);
  const targetPercent = Math.min(100, Math.round((todayMinutes / targetMinutes) * 100));

  return (
    <Card className="flex flex-col justify-between h-full bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:to-blue-950/30 border-blue-100 dark:border-blue-900/40">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400 flex items-center justify-center">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Today's Focus</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Target: {targetHours} study hours</p>
            </div>
          </div>
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
            {targetPercent}% Target
          </span>
        </div>

        {/* Focus Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-xs">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Today's Time</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {analytics.todayFormatted}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Target {targetHours}h</p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-xs">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sessions Done</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {completedCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Completed today</p>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => setActivePage('focus')}
        className="w-full mt-2 shadow-md shadow-blue-500/20"
        icon={Play}
      >
        Start Studying
      </Button>
    </Card>
  );
}
