import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { loadUserData, saveUserData } from '../services/dbService';
import { calculateStreakStats } from '../utils/streakCalculator';
import { calculateAnalytics } from '../utils/analyticsCalculator';
import { calculateSM2, getCardDueStatus } from '../utils/sm2';
import { playTimerCompletionSound } from '../utils/audio';
import { ALL_ACHIEVEMENTS } from '../utils/defaultData';
import confetti from 'canvas-confetti';

const StudyDataContext = createContext();

export function StudyDataProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.uid || 'guest';

  const [subjects, setSubjects] = useState([]);
  const [goals, setGoals] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [decks, setDecks] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userSettings, setUserSettings] = useState({
    dailyTargetMinutes: 120,
    defaultPomodoroMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    minStreakMinutes: 25,
    notificationsEnabled: true,
    soundEnabled: true,
    theme: 'light',
    weekStartDay: 'monday',
    onboardingCompleted: false,
  });
  const [loadingData, setLoadingData] = useState(true);

  // Toast message state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Load user data whenever userId changes
  useEffect(() => {
    let isMounted = true;
    async function initData() {
      setLoadingData(true);
      const data = await loadUserData(userId);
      if (isMounted && data) {
        setSubjects(data.subjects || []);
        setGoals(data.goals || []);
        setSessions(data.sessions || []);
        setDecks(data.decks || []);
        setFlashcards(data.flashcards || []);
        setQuotes(data.quotes || []);
        setAchievements(data.achievements || []);
        if (data.userSettings) setUserSettings(data.userSettings);
      }
      if (isMounted) setLoadingData(false);
    }
    initData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Sync to database whenever data changes (debounced/batched state sync)
  const syncCurrentData = useCallback(
    (newSubjects, newGoals, newSessions, newDecks, newCards, newQuotes, newAchs, newSettings) => {
      const payload = {
        subjects: newSubjects ?? subjects,
        goals: newGoals ?? goals,
        sessions: newSessions ?? sessions,
        decks: newDecks ?? decks,
        flashcards: newCards ?? flashcards,
        quotes: newQuotes ?? quotes,
        achievements: newAchs ?? achievements,
        userSettings: newSettings ?? userSettings,
      };
      saveUserData(userId, payload);
    },
    [userId, subjects, goals, sessions, decks, flashcards, quotes, achievements, userSettings]
  );

  // Dynamic calculations
  const streakStats = useMemo(() => {
    return calculateStreakStats(sessions, userSettings.minStreakMinutes || 25);
  }, [sessions, userSettings.minStreakMinutes]);

  const analytics = useMemo(() => {
    return calculateAnalytics({ sessions, subjects, goals });
  }, [sessions, subjects, goals]);

  const dueFlashcards = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return flashcards.filter((card) => {
      return !card.nextReviewDate || card.nextReviewDate <= todayStr;
    });
  }, [flashcards]);

  // Check achievements after session or card action
  const checkAchievements = useCallback(
    (currentSessions, currentCards, currentStreak) => {
      const completedSessions = currentSessions.filter((s) => s.status === 'completed');
      const totalHours = completedSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / 60;
      const unlockedKeys = new Set((achievements || []).map((a) => a.key));

      const newUnlocks = [];

      ALL_ACHIEVEMENTS.forEach((ach) => {
        if (unlockedKeys.has(ach.key)) return;

        let conditionMet = false;
        if (ach.key === 'streak_3' && currentStreak >= 3) conditionMet = true;
        if (ach.key === 'streak_7' && currentStreak >= 7) conditionMet = true;
        if (ach.key === 'streak_30' && currentStreak >= 30) conditionMet = true;
        if (ach.key === 'sessions_100' && completedSessions.length >= 100) conditionMet = true;
        if (ach.key === 'hours_10' && totalHours >= 10) conditionMet = true;
        if (ach.key === 'hours_50' && totalHours >= 50) conditionMet = true;
        if (ach.key === 'cards_100' && currentCards.filter((c) => c.repetitions > 0).length >= 100) conditionMet = true;

        if (conditionMet) {
          const unlockedItem = {
            id: `ach-${Date.now()}-${ach.key}`,
            userId,
            ...ach,
            unlockedAt: Date.now(),
          };
          newUnlocks.push(unlockedItem);
        }
      });

      if (newUnlocks.length > 0) {
        const updatedAchs = [...achievements, ...newUnlocks];
        setAchievements(updatedAchs);
        syncCurrentData(null, null, null, null, null, null, updatedAchs, null);

        newUnlocks.forEach((u) => {
          showToast(`Achievement Unlocked! ${u.icon} ${u.title}`, 'success');
          try {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
          } catch (e) {}
        });
      }
    },
    [achievements, userId, syncCurrentData, showToast]
  );

  // Subject Actions
  const addSubject = (name, color = '#3B82F6') => {
    const newSubject = {
      id: `subj-${Date.now()}`,
      userId,
      name,
      color,
      createdAt: Date.now(),
    };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    syncCurrentData(updated, null, null, null, null, null, null, null);
    showToast(`Subject "${name}" created.`, 'success');
    return newSubject;
  };

  const updateSubject = (id, updates) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSubjects(updated);
    syncCurrentData(updated, null, null, null, null, null, null, null);
    showToast('Subject updated.', 'success');
  };

  const deleteSubject = (id) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    syncCurrentData(updated, null, null, null, null, null, null, null);
    showToast('Subject deleted.', 'info');
  };

  // Goal Actions
  const addGoal = (goalData) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      userId,
      title: goalData.title,
      description: goalData.description || '',
      subjectId: goalData.subjectId || '',
      type: goalData.type || 'study_hours',
      targetValue: Number(goalData.targetValue) || 10,
      currentProgress: Number(goalData.currentProgress) || 0,
      unit: goalData.unit || 'hours',
      deadline: goalData.deadline || '',
      priority: goalData.priority || 'medium',
      status: 'active',
      createdAt: Date.now(),
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    syncCurrentData(null, updated, null, null, null, null, null, null);
    showToast(`Goal "${newGoal.title}" created!`, 'success');
    return newGoal;
  };

  const updateGoal = (id, updates) => {
    const updated = goals.map((g) => {
      if (g.id === id) {
        const next = { ...g, ...updates };
        if (next.currentProgress >= next.targetValue && g.status !== 'completed') {
          next.status = 'completed';
          showToast(`🎉 Goal Completed: ${next.title}!`, 'success');
          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } catch (e) {}
        }
        return next;
      }
      return g;
    });
    setGoals(updated);
    syncCurrentData(null, updated, null, null, null, null, null, null);
  };

  const deleteGoal = (id) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    syncCurrentData(null, updated, null, null, null, null, null, null);
    showToast('Goal deleted.', 'info');
  };

  // Session Actions (Pomodoro Completion)
  const recordCompletedSession = (sessionInfo) => {
    const newSession = {
      id: `sess-${Date.now()}`,
      userId,
      subjectId: sessionInfo.subjectId || '',
      goalId: sessionInfo.goalId || '',
      startedAt: sessionInfo.startedAt || Date.now() - (sessionInfo.durationMinutes || 25) * 60000,
      completedAt: Date.now(),
      durationMinutes: sessionInfo.durationMinutes || 25,
      sessionType: sessionInfo.sessionType || 'focus',
      status: 'completed',
      notes: sessionInfo.notes || '',
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);

    // Audio chime notification
    if (userSettings.soundEnabled) {
      playTimerCompletionSound();
    }

    // Automatically update linked goal progress if goalId specified
    let updatedGoals = goals;
    if (newSession.goalId) {
      updatedGoals = goals.map((g) => {
        if (g.id === newSession.goalId) {
          let progressIncrement = 0;
          if (g.type === 'study_hours') {
            progressIncrement = Number((newSession.durationMinutes / 60).toFixed(2));
          } else if (g.type === 'pomodoro_sessions') {
            progressIncrement = 1;
          }
          const newProgress = Math.min(g.targetValue, g.currentProgress + progressIncrement);
          const isFinished = newProgress >= g.targetValue;
          return {
            ...g,
            currentProgress: Number(newProgress.toFixed(2)),
            status: isFinished ? 'completed' : g.status,
          };
        }
        return g;
      });
      setGoals(updatedGoals);
    }

    syncCurrentData(null, updatedGoals, updatedSessions, null, null, null, null, null);
    showToast(`Focus session completed! (+${newSession.durationMinutes} mins)`, 'success');

    // Check achievement conditions
    const updatedStreak = calculateStreakStats(updatedSessions, userSettings.minStreakMinutes).currentStreak;
    checkAchievements(updatedSessions, flashcards, updatedStreak);

    return newSession;
  };

  // Flashcard Deck & Card Actions
  const addDeck = (title, description = '', subjectId = '') => {
    const newDeck = {
      id: `deck-${Date.now()}`,
      userId,
      title,
      description,
      subjectId,
      createdAt: Date.now(),
    };
    const updated = [...decks, newDeck];
    setDecks(updated);
    syncCurrentData(null, null, null, updated, null, null, null, null);
    showToast(`Deck "${title}" created.`, 'success');
    return newDeck;
  };

  const addFlashcard = (cardData) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newCard = {
      id: `card-${Date.now()}`,
      userId,
      deckId: cardData.deckId,
      subjectId: cardData.subjectId || '',
      question: cardData.question,
      answer: cardData.answer,
      tags: Array.isArray(cardData.tags) ? cardData.tags : (cardData.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: todayStr,
      state: 'new',
      createdAt: Date.now(),
    };
    const updated = [...flashcards, newCard];
    setFlashcards(updated);
    syncCurrentData(null, null, null, null, updated, null, null, null);
    showToast('Flashcard added.', 'success');
    return newCard;
  };

  const reviewFlashcard = (cardId, rating) => {
    const updatedCards = flashcards.map((c) => {
      if (c.id === cardId) {
        const sm2Result = calculateSM2(c, rating);
        return {
          ...c,
          ...sm2Result,
        };
      }
      return c;
    });
    setFlashcards(updatedCards);
    syncCurrentData(null, null, null, null, updatedCards, null, null, null);

    // Update goal progress if any goal tracks flashcards
    const reviewedCount = updatedCards.filter((c) => c.repetitions > 0).length;
    const updatedGoals = goals.map((g) => {
      if (g.type === 'flashcards') {
        const nextProg = Math.min(g.targetValue, reviewedCount);
        return {
          ...g,
          currentProgress: nextProg,
          status: nextProg >= g.targetValue ? 'completed' : g.status,
        };
      }
      return g;
    });
    if (updatedGoals !== goals) {
      setGoals(updatedGoals);
      syncCurrentData(null, updatedGoals, null, null, null, null, null, null);
    }
  };

  const deleteFlashcard = (cardId) => {
    const updated = flashcards.filter((c) => c.id !== cardId);
    setFlashcards(updated);
    syncCurrentData(null, null, null, null, updated, null, null, null);
    showToast('Flashcard deleted.', 'info');
  };

  // Quotes Action
  const toggleFavoriteQuote = (quoteId) => {
    const updated = quotes.map((q) => (q.id === quoteId ? { ...q, isFavorite: !q.isFavorite } : q));
    setQuotes(updated);
    syncCurrentData(null, null, null, null, null, updated, null, null);
  };

  // User Settings Update
  const updateSettings = (newSettings) => {
    const updated = { ...userSettings, ...newSettings };
    setUserSettings(updated);
    syncCurrentData(null, null, null, null, null, null, null, updated);
    showToast('Settings saved.', 'success');
  };

  // Reset Data Action
  const resetAllData = () => {
    localStorage.removeItem('studyforge_db_data_v1');
    window.location.reload();
  };

  return (
    <StudyDataContext.Provider
      value={{
        loadingData,
        subjects,
        goals,
        sessions,
        decks,
        flashcards,
        quotes,
        achievements,
        userSettings,
        streakStats,
        analytics,
        dueFlashcards,
        toast,
        showToast,
        addSubject,
        updateSubject,
        deleteSubject,
        addGoal,
        updateGoal,
        deleteGoal,
        recordCompletedSession,
        addDeck,
        addFlashcard,
        reviewFlashcard,
        deleteFlashcard,
        toggleFavoriteQuote,
        updateSettings,
        resetAllData,
      }}
    >
      {children}
    </StudyDataContext.Provider>
  );
}

export function useStudyData() {
  const context = useContext(StudyDataContext);
  if (!context) {
    throw new Error('useStudyData must be used within a StudyDataProvider');
  }
  return context;
}
