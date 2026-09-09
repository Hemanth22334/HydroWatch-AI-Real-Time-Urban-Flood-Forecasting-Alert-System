import React from 'react';

export default function Card({ children, className = '', hover = true, padding = 'p-6' }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card ${
        hover ? 'transition-card hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700' : ''
      } ${padding} ${className}`}
    >
      {children}
    </div>
  );
}
