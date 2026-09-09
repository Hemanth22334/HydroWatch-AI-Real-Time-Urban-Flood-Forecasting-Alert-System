import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useStudyData } from '../../context/StudyDataContext';

export default function SubjectModal({ isOpen, onClose, editingSubject = null }) {
  const { addSubject, updateSubject } = useStudyData();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const colorPresets = [
    '#3B82F6', // Blue
    '#10B981', // Emerald Green
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#06B6D4', // Cyan
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#EF4444', // Red
    '#64748B', // Slate
  ];

  useEffect(() => {
    if (editingSubject) {
      setName(editingSubject.name || '');
      setColor(editingSubject.color || '#3B82F6');
    } else {
      setName('');
      setColor('#3B82F6');
    }
  }, [editingSubject, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, { name, color });
    } else {
      addSubject(name, color);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSubject ? 'Edit Subject' : 'Add Custom Subject'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Subject Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Computer Networks, Database Systems"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Color Accent
          </label>
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-xl transition-all ${
                  color === c ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {editingSubject ? 'Save Changes' : 'Create Subject'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
