import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Play, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function LoginPage({ onNavigateToSignup, onNavigateToForgot, onLoginSuccess }) {
  const { login, loginAsGuest } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('Incorrect email or password.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async () => {
    setEmail('student@studyforge.edu');
    setPassword('study123');
    setError('');
    setLoading(true);
    try {
      await login('student@studyforge.edu', 'study123');
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      // Fallback to guest login
      loginAsGuest();
      if (onLoginSuccess) onLoginSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleGuestStudy = () => {
    loginAsGuest();
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
            S
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome to StudyForge
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Personal study operating system for technical subjects & exams
          </p>
        </div>

        {/* 1-Click Quick Access Options */}
        <div className="space-y-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGuestStudy}
            icon={Play}
            className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 text-base"
          >
            🚀 Instant Study Mode (No Signup Required)
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleDemoFill}
            icon={Key}
            className="w-full text-xs font-bold"
          >
            ⚡ Login with Sample Demo Account
          </Button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-slate-50 dark:bg-slate-950 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
            Or Login / Sign Up below
          </span>
        </div>

        {/* Login Form Card */}
        <Card className="shadow-xl border-slate-200/80 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onNavigateToForgot}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2 shadow-md shadow-blue-500/20"
              icon={LogIn}
            >
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToSignup}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
            >
              Create Account / Sign Up <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
