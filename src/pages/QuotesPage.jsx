import React, { useState } from 'react';
import { Quote, Heart, Search, Filter, Shuffle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useStudyData } from '../context/StudyDataContext';

export default function QuotesPage() {
  const { quotes, toggleFavoriteQuote } = useStudyData();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const categories = ['All', 'Discipline', 'Consistency', 'Focus', 'Learning', 'Resilience', 'Success'];

  const filteredQuotes = quotes.filter((q) => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch =
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = !onlyFavorites || q.isFavorite;
    return matchesCategory && matchesSearch && matchesFav;
  });

  const getRandomQuote = () => {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    alert(`"${quotes[randomIndex].text}"\n\n— ${quotes[randomIndex].author}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Quote className="w-6 h-6 text-blue-600" />
            Motivational Quotes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Curated Wisdom to fuel focus, discipline, and study consistency
          </p>
        </div>

        <Button variant="outline" onClick={getRandomQuote} icon={Shuffle}>
          Random Quote
        </Button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search author or quote..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Favorites Only Toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              onlyFavorites
                ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-300'
                : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuotes.map((q) => (
          <Card key={q.id} className="flex flex-col justify-between h-full relative group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {q.category || 'General'}
                </span>
                <button
                  onClick={() => toggleFavoriteQuote(q.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${q.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <blockquote className="my-2">
                <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic">
                  "{q.text}"
                </p>
                <footer className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400">
                  — {q.author}
                </footer>
              </blockquote>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
