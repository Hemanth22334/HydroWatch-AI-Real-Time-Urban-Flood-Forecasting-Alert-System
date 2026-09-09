/**
 * Analytics Calculator Utility for StudyForge
 */

import { formatDateKey } from './streakCalculator';

/**
 * Computes all dashboard and analytics metrics
 */
export function calculateAnalytics({ sessions = [], subjects = [], goals = [] }) {
  const completedSessions = sessions.filter((s) => s.status === 'completed');

  // Total Study Minutes & Hours
  const totalMinutes = completedSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Total completed session count
  const totalSessionsCount = completedSessions.length;

  // Average session duration in minutes
  const avgSessionMinutes = totalSessionsCount > 0
    ? Math.round(totalMinutes / totalSessionsCount)
    : 0;

  // Today's Study Time
  const todayKey = formatDateKey(new Date());
  const todaySessions = completedSessions.filter(
    (s) => formatDateKey(s.completedAt || s.startedAt) === todayKey
  );
  const todayMinutes = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

  // 1. Weekly Study Activity (Last 7 Days)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = formatDateKey(d);
    const dayLabel = daysOfWeek[d.getDay()];
    
    const dayMins = completedSessions
      .filter((s) => formatDateKey(s.completedAt || s.startedAt) === dateKey)
      .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    weeklyData.push({
      date: dateKey,
      day: dayLabel,
      formattedDate: `${d.getMonth() + 1}/${d.getDate()}`,
      minutes: dayMins,
      hours: Number((dayMins / 60).toFixed(2)),
      displayTime: formatMinutesToHoursMins(dayMins),
    });
  }

  // 2. Subject Distribution (Pie / Donut Chart)
  const subjectMap = {};
  subjects.forEach((subj) => {
    subjectMap[subj.id] = {
      name: subj.name,
      color: subj.color || '#3B82F6',
      minutes: 0,
      sessions: 0,
    };
  });

  // Include an "Other / Custom" bucket if session has missing or deleted subjectId
  let unassignedMins = 0;
  let unassignedSessions = 0;

  completedSessions.forEach((s) => {
    if (s.subjectId && subjectMap[s.subjectId]) {
      subjectMap[s.subjectId].minutes += s.durationMinutes || 0;
      subjectMap[s.subjectId].sessions += 1;
    } else {
      unassignedMins += s.durationMinutes || 0;
      unassignedSessions += 1;
    }
  });

  const subjectDistribution = Object.values(subjectMap)
    .filter((subj) => subj.minutes > 0)
    .map((subj) => ({
      id: subj.name,
      name: subj.name,
      value: Number((subj.minutes / 60).toFixed(1)),
      minutes: subj.minutes,
      color: subj.color,
      percentage: totalMinutes > 0 ? Math.round((subj.minutes / totalMinutes) * 100) : 0,
    }));

  if (unassignedMins > 0) {
    subjectDistribution.push({
      id: 'Other',
      name: 'Other',
      value: Number((unassignedMins / 60).toFixed(1)),
      minutes: unassignedMins,
      color: '#94A3B8',
      percentage: totalMinutes > 0 ? Math.round((unassignedMins / totalMinutes) * 100) : 0,
    });
  }

  // 3. Monthly Trend (Last 30 Days)
  const monthlyTrend = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = formatDateKey(d);
    
    const dayMins = completedSessions
      .filter((s) => formatDateKey(s.completedAt || s.startedAt) === dateKey)
      .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    monthlyTrend.push({
      date: dateKey,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      hours: Number((dayMins / 60).toFixed(2)),
      minutes: dayMins,
    });
  }

  // 4. Goal Performance Metrics
  const activeGoalsCount = goals.filter((g) => g.status === 'active').length;
  const completedGoalsCount = goals.filter((g) => g.status === 'completed').length;
  const pausedGoalsCount = goals.filter((g) => g.status === 'paused').length;

  const goalPerformanceData = [
    { name: 'Completed', value: completedGoalsCount, color: '#10B981' },
    { name: 'Active', value: activeGoalsCount, color: '#3B82F6' },
    { name: 'Paused', value: pausedGoalsCount, color: '#F59E0B' },
  ].filter((item) => item.value > 0);

  return {
    totalMinutes,
    totalHours,
    totalSessionsCount,
    avgSessionMinutes,
    todayMinutes,
    todayFormatted: formatMinutesToHoursMins(todayMinutes),
    weeklyData,
    subjectDistribution,
    monthlyTrend,
    goalMetrics: {
      active: activeGoalsCount,
      completed: completedGoalsCount,
      paused: pausedGoalsCount,
      total: goals.length,
      completionRate: goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0,
      data: goalPerformanceData,
    },
  };
}

/**
 * Format minutes into readable "2h 35m" or "45m"
 */
export function formatMinutesToHoursMins(mins = 0) {
  if (mins <= 0) return '0m';
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
