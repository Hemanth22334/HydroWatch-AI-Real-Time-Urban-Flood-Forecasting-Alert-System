import React from 'react';
import { Play, Sun, Moon, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useStudyData } from '../../context/StudyDataContext';

export default function Header({ setActivePage }) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { streakStats } = useStudyData();

  // Determine time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Student';

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Greeting & Date */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          {getGreeting()}, {userName} 👋
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
          {currentDateFormatted}
        </p>
      </div>

      {/* Action CTA & Theme Toggle */}
      <div className="flex items-center space-x-3">
        {/* Mobile Streak Indicator */}
        <div className="md:hidden flex items-center space-x-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-current" />
          <span>{streakStats.currentStreak}d</span>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Primary CTA button */}
        <button
          onClick={() => setActivePage('focus')}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span className="hidden sm:inline">Start Studying</span>
        </button>
      </div>
    </header>
  );
}
