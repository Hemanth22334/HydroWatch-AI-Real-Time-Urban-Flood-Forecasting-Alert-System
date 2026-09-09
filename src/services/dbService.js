import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import {
  DEFAULT_SUBJECTS,
  DEFAULT_GOALS,
  DEFAULT_DECKS,
  DEFAULT_FLASHCARDS,
  DEFAULT_QUOTES,
  ALL_ACHIEVEMENTS,
} from '../utils/defaultData';

const LOCAL_STORAGE_KEY = 'studyforge_db_data_v1';

/**
 * Load initial or saved study data for user
 */
export async function loadUserData(userId) {
  if (!isFirebaseConfigured || !userId) {
    return loadFromLocalStorage(userId);
  }

  try {
    const subjects = await fetchCollectionForUser('subjects', userId);
    const goals = await fetchCollectionForUser('goals', userId);
    const sessions = await fetchCollectionForUser('studySessions', userId);
    const decks = await fetchCollectionForUser('flashcardDecks', userId);
    const flashcards = await fetchCollectionForUser('flashcards', userId);
    const quotes = await fetchCollectionForUser('quotes', userId);
    const achievements = await fetchCollectionForUser('achievements', userId);
    const userSettingsDoc = await fetchSingleDoc('userSettings', userId);

    const hasData = subjects.length > 0 || goals.length > 0;

    if (!hasData) {
      // First time user seed
      const seeded = getSeededData(userId);
      await saveUserDataToFirestore(userId, seeded);
      saveToLocalStorage(userId, seeded);
      return seeded;
    }

    const loadedData = {
      subjects,
      goals,
      sessions,
      decks,
      flashcards,
      quotes: quotes.length > 0 ? quotes : DEFAULT_QUOTES,
      achievements,
      userSettings: userSettingsDoc || getDefaultSettings(userId),
    };

    saveToLocalStorage(userId, loadedData);
    return loadedData;
  } catch (err) {
    console.warn('Firestore load failed, falling back to LocalStorage:', err);
    return loadFromLocalStorage(userId);
  }
}

/**
 * Save complete user dataset locally and to Firestore
 */
export async function saveUserData(userId, data) {
  saveToLocalStorage(userId, data);
  if (isFirebaseConfigured && userId) {
    try {
      await saveUserDataToFirestore(userId, data);
    } catch (e) {
      console.warn('Background Firestore sync failed:', e);
    }
  }
}

function getSeededData(userId) {
  return {
    subjects: DEFAULT_SUBJECTS.map((s) => ({ ...s, userId })),
    goals: DEFAULT_GOALS.map((g) => ({ ...g, userId })),
    sessions: [
      {
        id: 'sess-1',
        userId,
        subjectId: 'subj-dsa',
        goalId: 'goal-1',
        startedAt: Date.now() - 86400000 * 2 - 3600000,
        completedAt: Date.now() - 86400000 * 2,
        durationMinutes: 50,
        sessionType: 'focus',
        status: 'completed',
      },
      {
        id: 'sess-2',
        userId,
        subjectId: 'subj-python',
        goalId: 'goal-3',
        startedAt: Date.now() - 86400000 - 3600000,
        completedAt: Date.now() - 86400000,
        durationMinutes: 25,
        sessionType: 'focus',
        status: 'completed',
      },
      {
        id: 'sess-3',
        userId,
        subjectId: 'subj-ml',
        goalId: 'goal-2',
        startedAt: Date.now() - 1800000,
        completedAt: Date.now(),
        durationMinutes: 30,
        sessionType: 'focus',
        status: 'completed',
      },
    ],
    decks: DEFAULT_DECKS.map((d) => ({ ...d, userId })),
    flashcards: DEFAULT_FLASHCARDS.map((f) => ({ ...f, userId })),
    quotes: DEFAULT_QUOTES,
    achievements: [
      {
        id: 'ach-1',
        userId,
        key: 'streak_3',
        title: '3-Day Streak',
        description: 'Complete study sessions for 3 consecutive days.',
        icon: '🔥',
        unlockedAt: Date.now() - 86400000,
      },
      {
        id: 'ach-2',
        userId,
        key: 'hours_10',
        title: '10 Study Hours',
        description: 'Log a total of 10 hours of focused study time.',
        icon: '📚',
        unlockedAt: Date.now() - 86400000 * 5,
      },
    ],
    userSettings: getDefaultSettings(userId),
  };
}

function getDefaultSettings(userId) {
  return {
    userId,
    dailyTargetMinutes: 120, // 2 hours
    defaultPomodoroMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    minStreakMinutes: 25,
    notificationsEnabled: true,
    soundEnabled: true,
    theme: 'light',
    weekStartDay: 'monday',
    onboardingCompleted: false,
  };
}

function loadFromLocalStorage(userId) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) return parsed;
    }
  } catch (e) {
    console.error('Error reading localStorage:', e);
  }
  const seeded = getSeededData(userId || 'guest');
  saveToLocalStorage(userId || 'guest', seeded);
  return seeded;
}

function saveToLocalStorage(userId, data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error writing localStorage:', e);
  }
}

async function fetchCollectionForUser(collName, userId) {
  const q = query(collection(db, collName), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function fetchSingleDoc(collName, docId) {
  const q = query(collection(db, collName), where('userId', '==', docId));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }
  return null;
}

async function saveUserDataToFirestore(userId, data) {
  // Batch write items to firestore
  const collections = ['subjects', 'goals', 'sessions', 'decks', 'flashcards', 'achievements'];
  for (const c of collections) {
    const items = data[c] || [];
    for (const item of items) {
      const docRef = doc(db, c === 'sessions' ? 'studySessions' : c === 'decks' ? 'flashcardDecks' : c, item.id);
      await setDoc(docRef, { ...item, userId }, { merge: true });
    }
  }
  if (data.userSettings) {
    const settingsRef = doc(db, 'userSettings', userId);
    await setDoc(settingsRef, { ...data.userSettings, userId }, { merge: true });
  }
}
