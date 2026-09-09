import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Clock,
  Volume2,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Save,
  CheckCircle2,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useStudyData } from '../context/StudyDataContext';
import { exportUserData, importUserDataFile } from '../utils/exportImport';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const studyData = useStudyData();
  const { userSettings, updateSettings, resetAllData } = studyData;

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [dailyTargetHours, setDailyTargetHours] = useState(
    ((userSettings.dailyTargetMinutes || 120) / 60).toFixed(1)
  );
  const [defaultPomodoro, setDefaultPomodoro] = useState(
    userSettings.defaultPomodoroMinutes || 25
  );
  const [shortBreak, setShortBreak] = useState(userSettings.shortBreakMinutes || 5);
  const [longBreak, setLongBreak] = useState(userSettings.longBreakMinutes || 15);
  const [minStreakMins, setMinStreakMins] = useState(userSettings.minStreakMinutes || 25);
  const [soundEnabled, setSoundEnabled] = useState(
    userSettings.soundEnabled !== undefined ? userSettings.soundEnabled : true
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      dailyTargetMinutes: Number(dailyTargetHours) * 60,
      defaultPomodoroMinutes: Number(defaultPomodoro),
      shortBreakMinutes: Number(shortBreak),
      longBreakMinutes: Number(longBreak),
      minStreakMinutes: Number(minStreakMins),
      soundEnabled,
      theme,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExport = () => {
    exportUserData(studyData);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const parsed = await importUserDataFile(file);
      if (window.confirm('Importing data will merge/overwrite existing study state. Continue?')) {
        studyData.syncCurrentData(
          parsed.subjects,
          parsed.goals,
          parsed.sessions,
          parsed.decks,
          parsed.flashcards,
          parsed.quotes,
          parsed.achievements,
          parsed.settings
        );
        alert('Data imported successfully!');
        window.location.reload();
      }
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    }
  };

  const handleResetConfirm = () => {
    if (
      window.confirm(
        '⚠️ Are you sure you want to reset all data? This action cannot be undone.'
      )
    ) {
      resetAllData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
          Application Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Customize targets, Pomodoro defaults, theme, and data management
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* User Profile Settings */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-5 h-5 text-blue-500" />
            User Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'student@studyforge.edu'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-sm font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </Card>

        {/* Study Targets & Pomodoro Defaults */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="w-5 h-5 text-emerald-500" />
            Study Targets & Pomodoro Timer Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Daily Target (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={dailyTargetHours}
                onChange={(e) => setDailyTargetHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Default Pomodoro (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={defaultPomodoro}
                onChange={(e) => setDefaultPomodoro(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Min Streak Duration (Mins)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={minStreakMins}
                onChange={(e) => setMinStreakMins(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Short Break (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={shortBreak}
                onChange={(e) => setShortBreak(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Long Break (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={longBreak}
                onChange={(e) => setLongBreak(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Preferences & Appearance */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sun className="w-5 h-5 text-amber-500" />
            Appearance & Audio
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Color Theme
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    theme === 'light'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    theme === 'dark'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Timer Sound Alarm
              </label>
              <label className="flex items-center space-x-3 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-slate-400" /> Play chime when Pomodoro completes
                </span>
              </label>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Settings updated!
            </span>
          ) : <div />}

          <Button type="submit" variant="primary" size="lg" icon={Save}>
            Save Preferences
          </Button>
        </div>
      </form>

      {/* Data Management Section */}
      <Card className="space-y-4 border-rose-100 dark:border-rose-950">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Download className="w-5 h-5 text-rose-500" />
          Data Backup & Management
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handleExport} icon={Download}>
            Export Backup (JSON)
          </Button>

          <label className="inline-flex items-center justify-center font-semibold rounded-xl transition-all border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 text-sm gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <Button variant="danger" onClick={handleResetConfirm} icon={RotateCcw}>
            Reset All Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
