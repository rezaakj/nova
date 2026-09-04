// components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CheckSquare, Trophy, Gift } from 'lucide-react';

const menuItems = [
  { name: 'داشبورد', href: '/admin', icon: LayoutDashboard },
  { name: 'مدیریت کاربران', href: '/admin/users', icon: Users },
  { name: 'تسک‌های شبکه‌های اجتماعی', href: '/admin/tasks', icon: CheckSquare },
  { name: 'لیدربورد (Leaderboard)', href: '/admin/leaderboard', icon: Trophy },
  { name: 'پاداش‌ها (Rewards)', href: '/admin/rewards', icon: Gift },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-950 border-r border-cyan-500/20 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
          <h1 className="text-xl font-bold tracking-wider text-cyan-400">NOVA ADMIN</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800 text-xs text-slate-500 text-center">
        NOVA System v2.0
      </div>
    </aside>
  );
}
