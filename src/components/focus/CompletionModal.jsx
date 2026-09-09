import React from 'react';
import { CheckCircle2, Flame, Brain, Play, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function CompletionModal({
  isOpen,
  onClose,
  completedSession,
  onStartAnotherSession,
  onReviewFlashcards,
}) {
  if (!completedSession) return null;

  const motivationalMessages = [
    "Consistency is what transforms average into excellence!",
    "Great work staying in deep focus today. Keep building that momentum!",
    "Another step closer to technical mastery. Excellent job!",
    "Focus is a superpower. You just leveled up yours!",
  ];

  const randomQuote = motivationalMessages[completedSession.durationMinutes % motivationalMessages.length];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Focus Session Completed! 🎉">
      <div className="text-center py-2 space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg animate-bounce-short">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
            +{completedSession.durationMinutes} Minutes Logged!
          </h4>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            Session recorded & analytics updated
          </p>
        </div>

        {/* Motivational Quote Banner */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Well Done</span>
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 italic">
            "{randomQuote}"
          </p>
        </div>

        {/* Next Action Buttons */}
        <div className="pt-3 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Next Action</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onStartAnotherSession();
              }}
              icon={Play}
              className="w-full"
            >
              Start Another
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onReviewFlashcards();
              }}
              icon={Brain}
              className="w-full"
            >
              Review Flashcards
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
