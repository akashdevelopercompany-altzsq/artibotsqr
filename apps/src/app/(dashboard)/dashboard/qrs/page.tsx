'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { QrCode, Edit, ExternalLink, Activity, Plus } from 'lucide-react';

export default function MyQRCodesPage() {
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
  }, [router]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-64 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My QR Codes</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            You have generated a total of <span className="font-bold text-slate-800">{qrs.length}</span> QR codes.
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="glass-button-primary inline-flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New
        </Link>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/40">
            <thead className="bg-white/20">
              <tr>
                <th scope="col" className="py-4 pl-4 pr-3 text-left text-sm font-bold text-slate-700 sm:pl-6">Name</th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-bold text-slate-700">Destination</th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-bold text-slate-700">Type</th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-bold text-slate-700">Scans</th>
                <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {qrs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-medium text-slate-500">
                    No QR codes found.
                  </td>
                </tr>
              ) : (
                qrs.map((qr) => (
                  <tr key={qr.id} className="hover:bg-white/40 transition-colors">
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-semibold text-slate-800 sm:pl-6">
                      {qr.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm font-medium text-slate-500 max-w-[200px] truncate">
                      {qr.destinationUrl}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm font-medium text-slate-500">
                      {qr.type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        qr.status === 'ACTIVE' 
                          ? 'bg-green-500/10 text-green-700' 
                          : 'bg-red-500/10 text-red-700'
                      }`}>
                        {qr.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm font-semibold text-slate-600">
                      <span className="bg-slate-100/50 px-3 py-1 rounded-md">{qr._count?.scans || 0}</span>
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3 flex justify-end items-center">
                      <Link href={`/dashboard/edit/${qr.id}`} className="text-slate-400 hover:text-blue-600 bg-white/50 p-2 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md" title="Edit Design">
                        <Edit className="h-5 w-5" />
                      </Link>
                      <Link href={`/analytics/${qr.id}`} className="text-slate-400 hover:text-blue-600 bg-white/50 p-2 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md" title="Analytics">
                        <Activity className="h-5 w-5" />
                      </Link>
                      <a href={`http://localhost:3001/q/${qr.shortCode}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 bg-white/50 p-2 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md" title="View Link">
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
