'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { QrCode, ArrowRight, ExternalLink, Activity, Plus } from 'lucide-react';

export default function DashboardOverview() {
  const [qrs, setQrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadQRs() {
      try {
        const res = await fetchApi('/qr');
        setQrs(res.data);
      } catch (err: any) {
        console.error(err);
        if (err.message === 'Unauthorized' || err.message?.includes('Unauthorized')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    }
    loadQRs();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-64 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <Link
          href="/dashboard/create"
          className="glass-button-primary inline-flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create QR
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-panel p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-2xl bg-blue-500/10 p-4 shadow-inner">
              <QrCode className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-semibold text-slate-500">Total QR Codes</dt>
                <dd className="text-3xl font-bold text-slate-800 mt-1">{qrs.length}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Recent QR Codes</h2>
        <div className="glass-panel overflow-hidden">
          <ul role="list" className="divide-y divide-slate-200/50">
            {qrs.length === 0 ? (
              <li className="px-6 py-12 text-center text-slate-500 font-medium">
                No QR codes created yet. <Link href="/dashboard/create" className="text-blue-600 hover:underline">Create your first one.</Link>
              </li>
            ) : qrs.slice(0, 5).map((qr) => (
              <li key={qr.id} className="flex items-center justify-between px-6 py-6 hover:bg-white/40 transition-colors">
                <div className="flex min-w-0 flex-1 items-center">
                  <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                    <div>
                      <p className="truncate text-base font-semibold text-blue-600">{qr.name}</p>
                      <p className="mt-2 flex items-center text-sm text-slate-500">
                        <span className="truncate">{qr.destinationUrl}</span>
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div>
                        <p className="text-sm text-slate-700 font-medium">Status: <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700 ml-2">{qr.status}</span></p>
                        <p className="mt-2 flex items-center text-sm text-slate-500 font-medium">
                          Total Scans: <span className="ml-2 bg-slate-100/50 px-2 py-0.5 rounded-md text-slate-700">{qr._count?.scans || 0}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Link href={`/analytics/${qr.id}`} className="text-slate-400 hover:text-blue-600 bg-white/50 p-2 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <Activity className="h-5 w-5" />
                  </Link>
                  <a href={`http://localhost:3001/q/${qr.shortCode}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 bg-white/50 p-2 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
