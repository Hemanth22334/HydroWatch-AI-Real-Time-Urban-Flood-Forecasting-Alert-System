import React, { useState } from 'react';
import { Sparkles, BookOpen, Clock, Timer, Target } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useStudyData } from '../../context/StudyDataContext';

export default function OnboardingModal({ isOpen, onClose }) {
  const { subjects, addSubject, addGoal, updateSettings } = useStudyData();

  const [step, setStep] = useState(1);
  const [selectedSubjectNames, setSelectedSubjectNames] = useState(['Data Structures & Algorithms', 'Python']);
  const [newSubjInput, setNewSubjInput] = useState('');
  const [dailyTargetHours, setDailyTargetHours] = useState(2);
  const [defaultPomodoro, setDefaultPomodoro] = useState(25);
  const [firstGoalTitle, setFirstGoalTitle] = useState('Complete Python Fundamentals');

  if (!isOpen) return null;

  const handleAddSubjectChip = () => {
    if (newSubjInput.trim() && !selectedSubjectNames.includes(newSubjInput.trim())) {
      setSelectedSubjectNames([...selectedSubjectNames, newSubjInput.trim()]);
      setNewSubjInput('');
    }
  };

  const handleFinish = () => {
    // Save onboarding settings
    updateSettings({
      dailyTargetMinutes: Number(dailyTargetHours) * 60,
      defaultPomodoroMinutes: Number(defaultPomodoro),
      onboardingCompleted: true,
    });

    // Add subjects if not already existing
    selectedSubjectNames.forEach((name) => {
      const exists = subjects.some((s) => s.name.toLowerCase() === name.toLowerCase());
      if (!exists) {
        addSubject(name);
      }
    });

    // Create first goal if specified
    if (firstGoalTitle.trim()) {
      addGoal({
        title: firstGoalTitle.trim(),
        description: 'Initial study milestone configured during onboarding.',
        type: 'study_hours',
        targetValue: 20,
        currentProgress: 0,
        unit: 'hours',
        priority: 'high',
      });
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to StudyForge 🎓" maxWidth="max-w-lg">
      <div className="space-y-6">
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>STEP {step} OF 4</span>
          <button onClick={onClose} className="text-blue-600 hover:underline">
            Skip Onboarding
          </button>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: What are you studying? */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <BookOpen className="w-5 h-5" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">What are you studying?</h4>
            </div>
            <p className="text-xs text-slate-500">Select or add subjects you want to master:</p>

            <div className="flex flex-wrap gap-2">
              {[
                'Data Structures & Algorithms',
                'Python',
                'Machine Learning',
                'Artificial Intelligence',
                'SQL',
                'Data Science',
                'Computer Networks',
                'Operating Systems',
              ].map((subj) => {
                const isSelected = selectedSubjectNames.includes(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSubjectNames(selectedSubjectNames.filter((s) => s !== subj));
                      } else {
                        setSelectedSubjectNames([...selectedSubjectNames, subj]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {subj} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom subject..."
                value={newSubjInput}
                onChange={(e) => setNewSubjInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubjectChip())}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <Button variant="outline" size="sm" onClick={handleAddSubjectChip}>
                Add
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Daily Target */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <Clock className="w-5 h-5" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Daily Study Target</h4>
            </div>
            <p className="text-xs text-slate-500">How many hours per day do you aim to study?</p>

            <div className="grid grid-cols-4 gap-3 py-2">
              {[1, 2, 3, 4].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setDailyTargetHours(hours)}
                  className={`p-4 rounded-xl border text-center font-bold text-base transition-all ${
                    dailyTargetHours === hours
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {hours}h / day
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Default Pomodoro */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <Timer className="w-5 h-5" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Default Pomodoro Preset</h4>
            </div>
            <p className="text-xs text-slate-500">Choose your preferred focus session length:</p>

            <div className="grid grid-cols-3 gap-3 py-2">
              {[
                { mins: 25, label: '25 / 5 min', desc: 'Standard' },
                { mins: 50, label: '50 / 10 min', desc: 'Deep Work' },
                { mins: 90, label: '90 / 20 min', desc: 'Ultra Focus' },
              ].map((item) => (
                <button
                  key={item.mins}
                  type="button"
                  onClick={() => setDefaultPomodoro(item.mins)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    defaultPomodoro === item.mins
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-[10px] opacity-80 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: First Goal */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <Target className="w-5 h-5" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Create Your First Goal</h4>
            </div>
            <p className="text-xs text-slate-500">What is your primary milestone right now?</p>

            <input
              type="text"
              placeholder="e.g., Complete Python Fundamentals"
              value={firstGoalTitle}
              onChange={(e) => setFirstGoalTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
            />
          </div>
        )}

        {/* Step Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : <div />}

          {step < 4 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              Next Step →
            </Button>
          ) : (
            <Button variant="primary" onClick={handleFinish} icon={Sparkles}>
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
