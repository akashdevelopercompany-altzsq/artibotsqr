'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, QrCode, Settings, LogOut, PlusCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My QR Codes', href: '/dashboard/qrs', icon: QrCode },
    { name: 'Create QR', href: '/dashboard/create', icon: PlusCircle },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen liquid-bg overflow-hidden p-4 sm:p-6 font-sans">
      {/* Sidebar - Floating Glass Panel */}
      <aside className="w-64 flex-col flex glass-panel mr-6 overflow-hidden">
        <div className="flex flex-col items-center justify-center pt-8 pb-4 px-4">
          <img src="/logo.svg" alt="ARTIBOTS Logo" className="h-16 w-16 mb-3" />
          <span className="text-2xl font-bold tracking-tight text-slate-800">ARTIBOTS</span>
        </div>
        
        <nav className="flex-1 space-y-2 px-6 py-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'
                    : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-700'
                }`}
              >
                <item.icon className={`mr-4 h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto rounded-3xl h-full pb-10 pr-4">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
