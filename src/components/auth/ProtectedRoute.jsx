import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, onRedirectToLogin }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center animate-pulse shadow-md">
            S
          </div>
          <p className="text-sm font-semibold text-slate-500">Loading StudyForge...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    if (onRedirectToLogin) onRedirectToLogin();
    return null;
  }

  return children;
}
