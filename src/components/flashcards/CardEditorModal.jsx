import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useStudyData } from '../../context/StudyDataContext';

export default function CardEditorModal({
  isOpen,
  onClose,
  initialDeckId = '',
  editingCard = null,
}) {
  const { decks, addFlashcard, syncCurrentData, flashcards } = useStudyData();

  const [deckId, setDeckId] = useState(initialDeckId || (decks[0]?.id || ''));
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (editingCard) {
      setDeckId(editingCard.deckId || '');
      setQuestion(editingCard.question || '');
      setAnswer(editingCard.answer || '');
      setTags(Array.isArray(editingCard.tags) ? editingCard.tags.join(', ') : '');
    } else {
      setDeckId(initialDeckId || (decks[0]?.id || ''));
      setQuestion('');
      setAnswer('');
      setTags('');
    }
  }, [editingCard, initialDeckId, isOpen, decks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    const selectedDeck = decks.find((d) => d.id === deckId);
    const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingCard) {
      const updatedCards = flashcards.map((c) =>
        c.id === editingCard.id
          ? {
              ...c,
              deckId,
              subjectId: selectedDeck?.subjectId || c.subjectId,
              question,
              answer,
              tags: parsedTags,
            }
          : c
      );
      syncCurrentData(null, null, null, null, updatedCards, null, null, null);
    } else {
      addFlashcard({
        deckId,
        subjectId: selectedDeck?.subjectId || '',
        question,
        answer,
        tags: parsedTags,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCard ? 'Edit Flashcard' : 'Add New Flashcard'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Target Deck
          </label>
          <select
            value={deckId}
            onChange={(e) => setDeckId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
          >
            {decks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>

        {/* Front / Question */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Front (Question) *
          </label>
          <textarea
            rows="3"
            required
            placeholder="e.g., What is the time complexity of searching a BST?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Back / Answer */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Back (Answer) *
          </label>
          <textarea
            rows="3"
            required
            placeholder="e.g., O(log n) in average/worst cases for balanced trees."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Tags (Comma Separated)
          </label>
          <input
            type="text"
            placeholder="e.g., bst, search, complexity"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700">
            {editingCard ? 'Save Changes' : 'Add Card'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
