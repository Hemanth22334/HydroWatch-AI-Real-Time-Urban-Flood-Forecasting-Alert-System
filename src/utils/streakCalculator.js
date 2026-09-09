/**
 * Streak Calculation Engine for StudyForge
 */

/**
 * Helper to get YYYY-MM-DD from timestamp or Date
 */
export function formatDateKey(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes streak statistics based on actual completed study sessions
 * 
 * @param {Array} sessions Array of StudySession objects
 * @param {number} minStreakMinutes Minimum study minutes required for a day to qualify (default 25)
 * @returns {Object} { currentStreak, longestStreak, totalStudyDays, weeklyConsistency, dailyMinutesMap, heatmapData }
 */
export function calculateStreakStats(sessions = [], minStreakMinutes = 25) {
  const dailyMinutesMap = {};

  // Aggregate completed sessions by date
  sessions.forEach((s) => {
    if (s.status !== 'completed') return;
    const dateKey = formatDateKey(s.completedAt || s.startedAt);
    if (!dateKey) return;

    dailyMinutesMap[dateKey] = (dailyMinutesMap[dateKey] || 0) + (s.durationMinutes || 0);
  });

  // Filter qualifying dates
  const qualifyingDates = Object.keys(dailyMinutesMap)
    .filter((d) => dailyMinutesMap[d] >= minStreakMinutes)
    .sort();

  const qualifyingSet = new Set(qualifyingDates);

  // Compute current & longest streak
  const today = new Date();
  const todayKey = formatDateKey(today);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  let currentStreak = 0;
  let checkDate = new Date();

  // Check if today or yesterday qualifies to anchor current streak
  if (!qualifyingSet.has(todayKey) && !qualifyingSet.has(yesterdayKey)) {
    currentStreak = 0;
  } else {
    // If today hasn't met target yet but yesterday did, start streak counting from yesterday
    if (!qualifyingSet.has(todayKey) && qualifyingSet.has(yesterdayKey)) {
      checkDate = yesterday;
    }

    while (qualifyingSet.has(formatDateKey(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Calculate longest streak across all recorded history
  let longestStreak = 0;
  let tempStreak = 0;

  if (qualifyingDates.length > 0) {
    let prevDate = null;
    qualifyingDates.forEach((dateStr) => {
      const currentDate = new Date(dateStr);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      prevDate = currentDate;
    });
  }

  // Calculate 7-day consistency percentage (last 7 days including today)
  let past7QualifyingCount = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (qualifyingSet.has(formatDateKey(d))) {
      past7QualifyingCount++;
    }
  }
  const weeklyConsistency = Math.round((past7QualifyingCount / 7) * 100);

  // Generate GitHub-style heatmap data for the past 365 days (52 weeks)
  const heatmapData = [];
  const totalDaysHeatmap = 364;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - totalDaysHeatmap);

  for (let i = 0; i <= totalDaysHeatmap; i++) {
    const cur = new Date(startDate);
    cur.setDate(cur.getDate() + i);
    const dateKey = formatDateKey(cur);
    const mins = dailyMinutesMap[dateKey] || 0;

    let intensity = 0;
    if (mins >= minStreakMinutes * 3) intensity = 4;
    else if (mins >= minStreakMinutes * 2) intensity = 3;
    else if (mins >= minStreakMinutes) intensity = 2;
    else if (mins > 0) intensity = 1;

    heatmapData.push({
      date: dateKey,
      minutes: mins,
      intensity,
      qualifies: mins >= minStreakMinutes,
    });
  }

  return {
    currentStreak,
    longestStreak,
    totalStudyDays: qualifyingDates.length,
    weeklyConsistency,
    dailyMinutesMap,
    heatmapData,
  };
}
