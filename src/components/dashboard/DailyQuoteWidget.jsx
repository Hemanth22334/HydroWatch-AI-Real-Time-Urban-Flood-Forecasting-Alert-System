import React, { useState } from 'react';
import { Quote, Heart, RefreshCw } from 'lucide-react';
import Card from '../common/Card';
import { useStudyData } from '../../context/StudyDataContext';

export default function DailyQuoteWidget() {
  const { quotes, toggleFavoriteQuote } = useStudyData();

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuote = quotes[currentIndex % (quotes.length || 1)] || {
    text: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
    category: 'Consistency',
    isFavorite: false,
  };

  const handleNextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  return (
    <Card className="h-full flex flex-col justify-between bg-slate-900 text-white dark:bg-slate-900 border-slate-800 relative overflow-hidden">
      {/* Decorative quote mark */}
      <Quote className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-800/40 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/30">
            Quote of the Day • {currentQuote.category || 'Focus'}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => toggleFavoriteQuote(currentQuote.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title={currentQuote.isFavorite ? 'Remove from favorites' : 'Bookmark favorite'}
            >
              <Heart
                className={`w-4 h-4 ${
                  currentQuote.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
            <button
              onClick={handleNextQuote}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next quote"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <blockquote className="my-2 relative z-10">
          <p className="text-base md:text-lg font-medium leading-relaxed italic text-slate-100">
            "{currentQuote.text}"
          </p>
          <footer className="mt-3 text-xs font-semibold text-blue-400">
            — {currentQuote.author || 'Anonymous'}
          </footer>
        </blockquote>
      </div>
    </Card>
  );
}
