import React from 'react';
import { Brain, Layers, Play, Plus, Edit3, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

export default function DeckCard({
  deck,
  subject,
  totalCardsCount = 0,
  dueCardsCount = 0,
  onStartReview,
  onAddCard,
  onEditDeck,
  onDeleteDeck,
}) {
  return (
    <Card className="flex flex-col justify-between h-full group">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: subject?.color || '#3B82F6' }}
            />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {subject?.name || 'General Subject'}
            </span>
          </div>
          <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEditDeck(deck)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Deck"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteDeck(deck.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Deck"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
          {deck.title}
        </h3>

        {deck.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
            {deck.description}
          </p>
        )}

        {/* Counters */}
        <div className="flex items-center space-x-3 my-3 text-xs">
          <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 font-semibold">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>{totalCardsCount} cards</span>
          </div>
          {dueCardsCount > 0 && (
            <span className="font-extrabold text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800">
              {dueCardsCount} due
            </span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onStartReview(deck.id)}
          disabled={totalCardsCount === 0}
          icon={Play}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {dueCardsCount > 0 ? `Review (${dueCardsCount})` : 'Study Deck'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddCard(deck.id)}
          icon={Plus}
          title="Add Card"
        >
          Card
        </Button>
      </div>
    </Card>
  );
}
