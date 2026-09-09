import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

/**
 * Register a new user with Firebase Auth (or fallback to local mock user)
 */
export async function registerUser(email, password, displayName) {
  if (!isFirebaseConfigured) {
    // Local development fallback
    const mockUser = {
      uid: 'local-demo-user-' + Date.now(),
      email,
      displayName: displayName || email.split('@')[0],
      createdAt: Date.now(),
    };
    localStorage.setItem('studyforge_local_user', JSON.stringify(mockUser));
    return mockUser;
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
}

/**
 * Log in an existing user
 */
export async function loginUser(email, password) {
  if (!isFirebaseConfigured) {
    const existing = localStorage.getItem('studyforge_local_user');
    if (existing) {
      return JSON.parse(existing);
    }
    const mockUser = {
      uid: 'local-demo-user-1',
      email,
      displayName: email.split('@')[0],
      createdAt: Date.now(),
    };
    localStorage.setItem('studyforge_local_user', JSON.stringify(mockUser));
    return mockUser;
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Password Reset
 */
export async function sendPasswordResetLink(email) {
  if (!isFirebaseConfigured) {
    return true;
  }
  await sendPasswordResetEmail(auth, email);
  return true;
}

/**
 * Log out
 */
export async function logoutUser() {
  if (!isFirebaseConfigured) {
    localStorage.removeItem('studyforge_local_user');
    return true;
  }
  await signOut(auth);
  return true;
}
