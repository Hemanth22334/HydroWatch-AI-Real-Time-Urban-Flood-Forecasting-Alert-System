import React from 'react';
import {
  LayoutDashboard,
  Timer,
  Target,
  Brain,
  BookOpen,
  BarChart3,
  Quote,
  Settings,
} from 'lucide-react';

export default function BottomNav({ activePage, setActivePage }) {
  const items = [
    { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
    { id: 'focus', label: 'Focus', icon: Timer, highlight: true },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'flashcards', label: 'Cards', icon: Brain },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'quotes', label: 'Quotes', icon: Quote },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-1 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                item.highlight && isActive
                  ? 'bg-blue-600 text-white dark:bg-blue-600'
                  : item.highlight
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                  : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
