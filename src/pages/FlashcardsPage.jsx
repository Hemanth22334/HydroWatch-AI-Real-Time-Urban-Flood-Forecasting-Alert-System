import React, { useState } from 'react';
import { Brain, Plus, Play, Layers, Clock, Sparkles } from 'lucide-react';
import DeckCard from '../components/flashcards/DeckCard';
import DeckModal from '../components/flashcards/DeckModal';
import CardEditorModal from '../components/flashcards/CardEditorModal';
import FlashcardReview from '../components/flashcards/FlashcardReview';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useStudyData } from '../context/StudyDataContext';

export default function FlashcardsPage() {
  const { decks, flashcards, subjects, dueFlashcards, syncCurrentData } = useStudyData();

  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewDeckId, setReviewDeckId] = useState(null);

  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardModalDeckId, setCardModalDeckId] = useState('');

  // Flashcard Dashboard Counters
  const dueTodayCount = dueFlashcards.length;

  const newCount = flashcards.filter((c) => !c.repetitions || c.repetitions === 0).length;

  const learningCount = flashcards.filter(
    (c) => c.repetitions > 0 && c.repetitions < 3
  ).length;

  const matureCount = flashcards.filter(
    (c) => c.repetitions >= 3 && (c.interval || 0) >= 14
  ).length;

  const getSubjectForDeck = (subjectId) => {
    return subjects.find((s) => s.id === subjectId);
  };

  const handleStartReviewAll = () => {
    setReviewDeckId(null);
    setIsReviewing(true);
  };

  const handleStartReviewDeck = (deckId) => {
    setReviewDeckId(deckId);
    setIsReviewing(true);
  };

  const handleDeleteDeck = (deckId) => {
    const updatedDecks = decks.filter((d) => d.id !== deckId);
    const updatedCards = flashcards.filter((c) => c.deckId !== deckId);
    syncCurrentData(null, null, null, updatedDecks, updatedCards, null, null, null);
  };

  if (isReviewing) {
    return (
      <FlashcardReview
        deckId={reviewDeckId}
        onFinishReview={() => setIsReviewing(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Spaced Repetition Flashcards
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Long-term memory retention via SM-2 algorithm
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setCardModalDeckId(decks[0]?.id || '');
              setIsCardModalOpen(true);
            }}
            icon={Plus}
          >
            Add Card
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditingDeck(null);
              setIsDeckModalOpen(true);
            }}
            icon={Plus}
            className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20"
          >
            Create Deck
          </Button>
        </div>
      </div>

      {/* Flashcard Dashboard Counters Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-950/40 border-purple-200 dark:border-purple-900/60">
          <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Due Today</p>
          <p className="text-3xl font-black text-purple-900 dark:text-purple-100 mt-1">{dueTodayCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Ready for review</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Cards</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{newCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Unseen items</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Learning</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{learningCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">In acquisition phase</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Mature</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{matureCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Long-term memory</p>
        </Card>
      </div>

      {/* Global Start Review Banner CTA */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white dark:bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {dueTodayCount > 0 ? `${dueTodayCount} Flashcards Due for Review` : "You're caught up!"}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {dueTodayCount > 0
                ? 'Reviewing cards today reinforces recall and expands interval spacing.'
                : 'Nice job. All current cards are up to date!'}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={flashcards.length === 0}
          onClick={handleStartReviewAll}
          icon={Play}
          className="bg-purple-600 hover:bg-purple-700 px-6 whitespace-nowrap"
        >
          {dueTodayCount > 0 ? 'Start Review' : 'Practice All Cards'}
        </Button>
      </div>

      {/* Decks Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-500" />
          Flashcard Decks ({decks.length})
        </h3>

        {decks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Brain className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">No decks created yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Organize your technical flashcards into subject decks</p>
            <Button
              variant="primary"
              onClick={() => {
                setEditingDeck(null);
                setIsDeckModalOpen(true);
              }}
              icon={Plus}
            >
              Create First Deck
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => {
              const deckCards = flashcards.filter((c) => c.deckId === deck.id);
              const dueInDeck = dueFlashcards.filter((c) => c.deckId === deck.id).length;
              return (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  subject={getSubjectForDeck(deck.subjectId)}
                  totalCardsCount={deckCards.length}
                  dueCardsCount={dueInDeck}
                  onStartReview={handleStartReviewDeck}
                  onAddCard={(dId) => {
                    setCardModalDeckId(dId);
                    setIsCardModalOpen(true);
                  }}
                  onEditDeck={(d) => {
                    setEditingDeck(d);
                    setIsDeckModalOpen(true);
                  }}
                  onDeleteDeck={handleDeleteDeck}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <DeckModal
        isOpen={isDeckModalOpen}
        onClose={() => setIsDeckModalOpen(false)}
        editingDeck={editingDeck}
      />

      <CardEditorModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        initialDeckId={cardModalDeckId}
      />
    </div>
  );
}
