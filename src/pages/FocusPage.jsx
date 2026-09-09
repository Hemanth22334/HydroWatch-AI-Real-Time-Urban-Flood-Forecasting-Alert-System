import React, { useState, useEffect, useRef } from 'react';
import { Play, Settings, Sparkles, BookOpen, Target } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import TimerDisplay from '../components/focus/TimerDisplay';
import TimerControls from '../components/focus/TimerControls';
import PresetSelector from '../components/focus/PresetSelector';
import SessionSetupModal from '../components/focus/SessionSetupModal';
import CompletionModal from '../components/focus/CompletionModal';
import { useStudyData } from '../context/StudyDataContext';

export default function FocusPage({ setActivePage, initialGoal = null }) {
  const { subjects, goals, recordCompletedSession, userSettings } = useStudyData();

  // Timer state
  const [selectedPreset, setSelectedPreset] = useState('25/5');
  const [customMinutes, setCustomMinutes] = useState(25);

  const [focusMinutes, setFocusMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);

  const [sessionType, setSessionType] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Selected subject & goal for active session
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedGoalId, setSelectedGoalId] = useState(initialGoal?.id || '');

  // Session metadata
  const [sessionStartTime, setSessionStartTime] = useState(null);

  // Modals
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [lastCompletedSession, setLastCompletedSession] = useState(null);

  const timerRef = useRef(null);

  // Synchronize timer duration when preset changes
  const applyPreset = (preset) => {
    setSelectedPreset(preset.id);
    if (preset.id === 'custom') {
      const mins = customMinutes || 25;
      setFocusMinutes(mins);
      setSecondsLeft(mins * 60);
      setTotalSeconds(mins * 60);
    } else {
      setFocusMinutes(preset.focusMins);
      setShortBreakMinutes(preset.breakMins);
      setSecondsLeft(preset.focusMins * 60);
      setTotalSeconds(preset.focusMins * 60);
    }
  };

  // Live timer interval loop
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, isPaused]);

  // Handle timer reaching zero
  const handleTimerFinished = () => {
    setIsRunning(false);
    setIsPaused(false);

    if (sessionType === 'focus') {
      // Record completed session
      const completed = recordCompletedSession({
        subjectId: selectedSubjectId || (subjects[0]?.id || ''),
        goalId: selectedGoalId || '',
        durationMinutes: focusMinutes,
        sessionType: 'focus',
        startedAt: sessionStartTime || Date.now() - focusMinutes * 60000,
      });

      setLastCompletedSession(completed);
      setIsCompletionOpen(true);

      // Auto-switch to break mode
      setSessionType('shortBreak');
      setSecondsLeft(shortBreakMinutes * 60);
      setTotalSeconds(shortBreakMinutes * 60);
    } else {
      // Break finished, switch back to focus
      setSessionType('focus');
      setSecondsLeft(focusMinutes * 60);
      setTotalSeconds(focusMinutes * 60);
    }
  };

  // Timer Controls Actions
  const handleStart = () => {
    setSessionStartTime(Date.now());
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSecondsLeft(totalSeconds);
  };

  const handleStop = () => {
    // Abandon current session
    setIsRunning(false);
    setIsPaused(false);
    setSecondsLeft(totalSeconds);
  };

  const handleSkipBreak = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSessionType('focus');
    setSecondsLeft(focusMinutes * 60);
    setTotalSeconds(focusMinutes * 60);
  };

  const handleConfigureStart = (config) => {
    setSelectedSubjectId(config.subjectId);
    setSelectedGoalId(config.goalId);
    setFocusMinutes(config.durationMinutes);
    setSecondsLeft(config.durationMinutes * 60);
    setTotalSeconds(config.durationMinutes * 60);
    setSessionType('focus');
    setSessionStartTime(Date.now());
    setIsRunning(true);
    setIsPaused(false);
  };

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const activeGoal = goals.find((g) => g.id === selectedGoalId);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Configuration Header Card */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-12 rounded-lg flex-shrink-0"
            style={{ backgroundColor: activeSubject?.color || '#3B82F6' }}
          />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Subject & Goal</p>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              {activeSubject?.name || 'Select Subject'}
            </h3>
            {activeGoal && (
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                🎯 {activeGoal.title} ({activeGoal.currentProgress}/{activeGoal.targetValue} {activeGoal.unit})
              </p>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsSetupOpen(true)}
          disabled={isRunning}
          icon={Settings}
        >
          Change Setup
        </Button>
      </Card>

      {/* Preset Selector */}
      <PresetSelector
        selectedPreset={selectedPreset}
        onSelectPreset={applyPreset}
        customMinutes={customMinutes}
        onCustomMinutesChange={(m) => {
          setCustomMinutes(m);
          setFocusMinutes(m);
          setSecondsLeft(m * 60);
          setTotalSeconds(m * 60);
        }}
        disabled={isRunning}
      />

      {/* Timer Visual Display */}
      <Card className="py-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl">
        <TimerDisplay
          secondsLeft={secondsLeft}
          totalSeconds={totalSeconds}
          sessionType={sessionType}
          subjectName={activeSubject?.name}
          subjectColor={activeSubject?.color}
          goalTitle={activeGoal?.title}
          isRunning={isRunning}
        />

        {/* Controls */}
        <TimerControls
          isRunning={isRunning}
          isPaused={isPaused}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
          onSkipBreak={handleSkipBreak}
          onStop={handleStop}
          sessionType={sessionType}
        />
      </Card>

      {/* Modals */}
      <SessionSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStartSession={handleConfigureStart}
        initialSubjectId={selectedSubjectId}
        initialGoalId={selectedGoalId}
      />

      <CompletionModal
        isOpen={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        completedSession={lastCompletedSession}
        onStartAnotherSession={() => {
          setSessionType('focus');
          setSecondsLeft(focusMinutes * 60);
          setTotalSeconds(focusMinutes * 60);
          handleStart();
        }}
        onReviewFlashcards={() => setActivePage('flashcards')}
      />
    </div>
  );
}
