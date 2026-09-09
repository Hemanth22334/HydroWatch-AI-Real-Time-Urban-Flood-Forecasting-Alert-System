import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStudyData } from '../../context/StudyDataContext';

export default function Toast() {
  const { toast, showToast } = useStudyData();

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short max-w-sm w-full px-4">
      <div
        className={`flex items-center justify-between p-4 rounded-xl border shadow-lg ${
          bgColors[toast.type] || bgColors.info
        }`}
      >
        <div className="flex items-center space-x-3">
          {icons[toast.type] || icons.info}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <button
          onClick={() => showToast(null)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
