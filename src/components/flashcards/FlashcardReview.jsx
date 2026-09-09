import React, { useState } from 'react';
import { Eye, CheckCircle2, RotateCcw, ArrowLeft, Brain, Sparkles } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useStudyData } from '../../context/StudyDataContext';

export default function FlashcardReview({ deckId = null, onFinishReview }) {
  const { flashcards, reviewFlashcard, subjects } = useStudyData();

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter due cards (due today or unreviewed) for the specific deck (or all decks if deckId is null)
  const dueQueue = flashcards.filter((c) => {
    const matchesDeck = !deckId || c.deckId === deckId;
    const isDue = !c.nextReviewDate || c.nextReviewDate <= todayStr;
    return matchesDeck && isDue;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const currentCard = dueQueue[currentIndex];

  const handleRating = (rating) => {
    if (!currentCard) return;

    reviewFlashcard(currentCard.id, rating);
    setReviewedCount((prev) => prev + 1);
    setIsAnswerRevealed(false);

    if (currentIndex + 1 < dueQueue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Reached end of queue
      setCurrentIndex(dueQueue.length);
    }
  };

  // Completion summary screen
  if (!currentCard || currentIndex >= dueQueue.length) {
    return (
      <Card className="max-w-xl mx-auto text-center py-10 px-6 my-6 bg-gradient-to-br from-purple-50/60 via-white to-pink-50/30 dark:from-slate-900 dark:to-purple-950/40">
        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mx-auto flex items-center justify-center mb-4 shadow-md">
          <Sparkles className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          Review Session Complete! 🎉
        </h3>
        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">
          You reviewed {reviewedCount} {reviewedCount === 1 ? 'card' : 'cards'} today.
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto my-4">
          Spaced repetition algorithm has rescheduled your cards based on recall accuracy. Keep up the consistent reviews!
        </p>

        <div className="pt-2">
          <Button
            variant="primary"
            onClick={onFinishReview}
            icon={ArrowLeft}
            className="bg-purple-600 hover:bg-purple-700 shadow-md"
          >
            Back to Flashcards
          </Button>
        </div>
      </Card>
    );
  }

  const subject = subjects.find((s) => s.id === currentCard.subjectId);
  const remainingInQueue = dueQueue.length - currentIndex;

  return (
    <div className="max-w-2xl mx-auto my-4 space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onFinishReview}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Review</span>
        </button>

        <div className="flex items-center space-x-2">
          {subject && (
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: subject.color }}
            >
              {subject.name}
            </span>
          )}
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            {remainingInQueue} remaining
          </span>
        </div>
      </div>

      {/* Main Flashcard Container */}
      <Card className="min-h-[320px] flex flex-col justify-between p-8 bg-white dark:bg-slate-900 border-2 border-purple-100 dark:border-purple-900/60 shadow-xl relative overflow-hidden">
        {/* Card Front (Question) */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <span>Question (Front)</span>
            <span>EF: {currentCard.easeFactor || 2.5} • Reps: {currentCard.repetitions || 0}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentCard.question}
          </h3>

          {currentCard.tags && currentCard.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {currentCard.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Revealed Answer (Back) */}
        {isAnswerRevealed ? (
          <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-800 animate-fade-in">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              Answer (Back)
            </div>
            <p className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {currentCard.answer}
            </p>
          </div>
        ) : (
          <div className="mt-8 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsAnswerRevealed(true)}
              icon={Eye}
              className="bg-purple-600 hover:bg-purple-700 shadow-md px-8"
            >
              Show Answer
            </Button>
          </div>
        )}
      </Card>

      {/* SM-2 Recall Rating Buttons */}
      {isAnswerRevealed && (
        <div className="grid grid-cols-4 gap-2.5 animate-fade-in">
          <button
            onClick={() => handleRating('again')}
            className="p-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300 font-bold text-sm text-center transition-all shadow-xs"
          >
            <p>Again</p>
            <p className="text-[10px] opacity-75 mt-0.5">1 day</p>
          </button>

          <button
            onClick={() => handleRating('hard')}
            className="p-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-300 font-bold text-sm text-center transition-all shadow-xs"
          >
            <p>Hard</p>
            <p className="text-[10px] opacity-75 mt-0.5">
              {Math.max(1, Math.round((currentCard.interval || 1) * 1.2))} days
            </p>
          </button>

          <button
            onClick={() => handleRating('good')}
            className="p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:border-blue-900 dark:text-blue-300 font-bold text-sm text-center transition-all shadow-xs"
          >
            <p>Good</p>
            <p className="text-[10px] opacity-75 mt-0.5">
              {Math.max(1, Math.round((currentCard.interval || 1) * (currentCard.easeFactor || 2.5)))} days
            </p>
          </button>

          <button
            onClick={() => handleRating('easy')}
            className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300 font-bold text-sm text-center transition-all shadow-xs"
          >
            <p>Easy</p>
            <p className="text-[10px] opacity-75 mt-0.5">
              {Math.max(2, Math.round((currentCard.interval || 1) * (currentCard.easeFactor || 2.5) * 1.3))} days
            </p>
          </button>
        </div>
      )}
    </div>
  );
}
