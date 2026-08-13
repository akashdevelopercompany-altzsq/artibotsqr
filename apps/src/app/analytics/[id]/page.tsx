'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Activity, Users, Smartphone, Globe } from 'lucide-react';

export default function AnalyticsPage() {
  const { id } = useParams();
  const [summary, setSummary] = useState({ totalScans: 0, uniqueScans: 0 });
  const [timeseries, setTimeseries] = useState([]);
  const [devices, setDevices] = useState({ devices: [], os: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, timeRes, devRes] = await Promise.all([
          fetchApi(`/qr/${id}/analytics/summary`),
          fetchApi(`/qr/${id}/analytics/timeseries?days=30`),
          fetchApi(`/qr/${id}/analytics/devices`),
        ]);
        setSummary(sumRes.data);
        
        // Format dates for the chart
        const formattedTimeseries = timeRes.data.map((item: any) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }));
        setTimeseries(formattedTimeseries);
        
        setDevices(devRes.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QR Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Performance metrics for the last 30 days</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalScans}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-300">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Scanners</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.uniqueScans}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Timeline Chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-6 flex items-center text-lg font-medium text-gray-900 dark:text-white">
              <Activity className="mr-2 h-5 w-5 text-gray-500" /> Scan Timeline
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeseries}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* OS Breakdown Chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-6 flex items-center text-lg font-medium text-gray-900 dark:text-white">
              <Smartphone className="mr-2 h-5 w-5 text-gray-500" /> OS Distribution
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={devices.os}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="os" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }}
                  />
                  <Bar dataKey="_count.id" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
