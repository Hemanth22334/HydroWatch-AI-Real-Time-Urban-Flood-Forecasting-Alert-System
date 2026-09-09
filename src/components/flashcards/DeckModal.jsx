import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useStudyData } from '../../context/StudyDataContext';

export default function DeckModal({ isOpen, onClose, editingDeck = null }) {
  const { subjects, addDeck, syncCurrentData, decks } = useStudyData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');

  useEffect(() => {
    if (editingDeck) {
      setTitle(editingDeck.title || '');
      setDescription(editingDeck.description || '');
      setSubjectId(editingDeck.subjectId || '');
    } else {
      setTitle('');
      setDescription('');
      setSubjectId(subjects[0]?.id || '');
    }
  }, [editingDeck, isOpen, subjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingDeck) {
      const updatedDecks = decks.map((d) => (d.id === editingDeck.id ? { ...d, title, description, subjectId } : d));
      syncCurrentData(null, null, null, updatedDecks, null, null, null, null);
    } else {
      addDeck(title, description, subjectId || subjects[0]?.id || '');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDeck ? 'Edit Flashcard Deck' : 'Create Flashcard Deck'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Deck Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., DSA Core Concepts, Python Mechanics"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows="2"
            placeholder="Summary of topics covered in this deck..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Subject
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700">
            {editingDeck ? 'Save Changes' : 'Create Deck'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
