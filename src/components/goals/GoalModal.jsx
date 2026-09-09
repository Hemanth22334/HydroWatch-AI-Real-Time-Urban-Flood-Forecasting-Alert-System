import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useStudyData } from '../../context/StudyDataContext';

export default function GoalModal({ isOpen, onClose, editingGoal = null }) {
  const { subjects, addGoal, updateGoal } = useStudyData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [type, setType] = useState('study_hours');
  const [targetValue, setTargetValue] = useState(10);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [unit, setUnit] = useState('hours');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title || '');
      setDescription(editingGoal.description || '');
      setSubjectId(editingGoal.subjectId || '');
      setType(editingGoal.type || 'study_hours');
      setTargetValue(editingGoal.targetValue || 10);
      setCurrentProgress(editingGoal.currentProgress || 0);
      setUnit(editingGoal.unit || 'hours');
      setDeadline(editingGoal.deadline || '');
      setPriority(editingGoal.priority || 'medium');
    } else {
      setTitle('');
      setDescription('');
      setSubjectId(subjects[0]?.id || '');
      setType('study_hours');
      setTargetValue(10);
      setCurrentProgress(0);
      setUnit('hours');
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 14);
      setDeadline(defaultDate.toISOString().split('T')[0]);
      setPriority('medium');
    }
  }, [editingGoal, isOpen, subjects]);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'study_hours') setUnit('hours');
    else if (newType === 'pomodoro_sessions') setUnit('sessions');
    else if (newType === 'chapters') setUnit('chapters');
    else if (newType === 'topics') setUnit('topics');
    else if (newType === 'flashcards') setUnit('cards');
    else setUnit('units');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      subjectId: subjectId || subjects[0]?.id || '',
      type,
      targetValue: Number(targetValue),
      currentProgress: Number(currentProgress),
      unit,
      deadline,
      priority,
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, payload);
    } else {
      addGoal(payload);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingGoal ? 'Edit Study Goal' : 'Create New Study Goal'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Goal Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Complete Python DSA Preparation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows="2"
            placeholder="Brief details about what needs to be achieved..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subject & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
            >
              <option value="high">🔥 High</option>
              <option value="medium">⚡ Medium</option>
              <option value="low">🌱 Low</option>
            </select>
          </div>
        </div>

        {/* Goal Type & Target Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Goal Type
            </label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
            >
              <option value="study_hours">Study Hours</option>
              <option value="pomodoro_sessions">Pomodoro Sessions</option>
              <option value="chapters">Chapters</option>
              <option value="topics">Topics</option>
              <option value="flashcards">Flashcards</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Target ({unit})
            </label>
            <input
              type="number"
              min="1"
              required
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Initial Progress
            </label>
            <input
              type="number"
              min="0"
              value={currentProgress}
              onChange={(e) => setCurrentProgress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
            />
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Target Deadline
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end space-x-3 pt-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {editingGoal ? 'Save Changes' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
