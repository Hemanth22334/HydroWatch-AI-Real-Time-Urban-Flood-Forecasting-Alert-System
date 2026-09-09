import React from 'react';
import { BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import Card from '../common/Card';
import { useStudyData } from '../../context/StudyDataContext';

export default function ActivityChartWidget() {
  const { analytics } = useStudyData();
  const weeklyData = analytics.weeklyData || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-medium border border-slate-700">
          <p className="font-bold text-slate-200">{data.day} ({data.formattedDate})</p>
          <p className="text-blue-400 text-sm font-extrabold mt-0.5">{data.displayTime}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Weekly Activity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Study hours over last 7 days</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total {analytics.totalHours}h logged
          </span>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-48 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                unit="h"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {weeklyData.map((entry, index) => {
                  const isToday = index === 6;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isToday ? '#2563EB' : '#93C5FD'}
                      className="transition-all hover:opacity-80"
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
