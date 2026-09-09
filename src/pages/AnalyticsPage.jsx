import React from 'react';
import { BarChart3, Clock, CheckCircle2, Flame, Award, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import Card from '../components/common/Card';
import Heatmap from '../components/common/Heatmap';
import { useStudyData } from '../context/StudyDataContext';

export default function AnalyticsPage() {
  const { analytics, streakStats, userSettings } = useStudyData();

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Study Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Comprehensive performance data, time distribution, and habits tracking
        </p>
      </div>

      {/* Top Key Performance Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Hours</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{analytics.totalHours}h</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{analytics.totalMinutes} total mins</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sessions</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{analytics.totalSessionsCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Completed</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Session</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{analytics.avgSessionMinutes}m</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Per focus block</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Streak</p>
          <p className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">🔥 {streakStats.currentStreak}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Consecutive days</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Longest Streak</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{streakStats.longestStreak} days</p>
          <p className="text-[10px] text-slate-400 mt-0.5">All-time record</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Study Days</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{streakStats.totalStudyDays}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Qualifying days</p>
        </Card>
      </div>

      {/* GitHub Calendar Heatmap */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Study Consistency Heatmap (Past 52 Weeks)
        </h3>
        <Heatmap
          heatmapData={streakStats.heatmapData}
          minStreakMinutes={userSettings.minStreakMinutes || 25}
        />
      </Card>

      {/* Charts Grid: Weekly Activity & Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Study Bar Chart */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Weekly Activity (Last 7 Days)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="h" />
                <Tooltip />
                <Bar dataKey="hours" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Subject Breakdown Pie/Donut Chart */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-purple-500" />
            Subject Time Distribution
          </h3>
          {analytics.subjectDistribution.length === 0 ? (
            <p className="text-xs text-slate-400 py-16 text-center">No subject session data logged yet.</p>
          ) : (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.subjectDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {analytics.subjectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val} hours`, 'Time']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Monthly Trend Area Chart */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          30-Day Study Trend
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="h" />
              <Tooltip />
              <Area type="monotone" dataKey="hours" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
