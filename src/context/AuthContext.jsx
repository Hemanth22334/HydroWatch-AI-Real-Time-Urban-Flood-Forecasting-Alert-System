import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import {
  loginUser,
  registerUser,
  sendPasswordResetLink,
  logoutUser,
} from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Local fallback auth state
      const savedUser = localStorage.getItem('studyforge_local_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        // Create a default local user for instant exploration if user visits without logging in
        const demoUser = {
          uid: 'demo-student-101',
          email: 'student@studyforge.edu',
          displayName: 'Hemanth',
          createdAt: Date.now(),
        };
        setUser(demoUser);
        localStorage.setItem('studyforge_local_user', JSON.stringify(demoUser));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await loginUser(email, password);
      setUser({
        uid: loggedUser.uid,
        email: loggedUser.email,
        displayName: loggedUser.displayName || email.split('@')[0],
      });
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      uid: 'guest-student-' + Date.now(),
      email: 'guest@studyforge.edu',
      displayName: 'Guest Student',
      createdAt: Date.now(),
    };
    setUser(guestUser);
    localStorage.setItem('studyforge_local_user', JSON.stringify(guestUser));
    return guestUser;
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    try {
      const newUser = await registerUser(email, password, name);
      setUser({
        uid: newUser.uid,
        email: newUser.email,
        displayName: name || email.split('@')[0],
      });
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    return await sendPasswordResetLink(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        loginAsGuest,
        signup,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
