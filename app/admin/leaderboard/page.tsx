'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy, Medal, Crown, Loader2, RefreshCw } from 'lucide-react';

const supabase = createClient(
  'https://marfjuozuapydfdmcybv.supabase.co',
  'sb_publishable_ZVfB67bxvtRdTtabTSfW_Q_HiNPfsSK'
);

interface LeaderboardUser {
  id: string;
  username: string;
  email: string;
  nova_points: number;
  level: number;
}

export default function AdminLeaderboardPage() {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email, nova_points, level')
      .order('nova_points', { ascending: false })
      .limit(50);

    if (error) {
      console.error('خطا در دریافت جدول برترین‌ها:', error.message);
    } else if (data) {
      setTopUsers(data as LeaderboardUser[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            جدول برترین‌ها (Leaderboard) <Trophy className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            رتبه‌بندی ۵۰ کاربر برتر NOVA بر اساس بیشترین امتیاز (NOVA Points)
          </p>
        </div>
        <button
          onClick={fetchLeaderboard}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 text-xs transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          به‌روزرسانی
        </button>
      </div>

      {!loading && topUsers.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden order-2 md:order-1">
            <Medal className="w-8 h-8 text-slate-300 mb-2" />
            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full mb-2">رتبه ۲</span>
            <h3 className="font-bold text-white text-base">{topUsers[1]?.username || 'کاربر بدون نام'}</h3>
            <p className="text-cyan-400 font-extrabold text-lg mt-1">{topUsers[1]?.nova_points || 0} PTS</p>
          </div>

          <div className="bg-slate-950 border border-amber-500/40 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.15)] order-1 md:order-2">
            <Crown className="w-10 h-10 text-amber-400 mb-2 animate-bounce" />
            <span className="text-xs font-bold text-amber-950 bg-amber-400 px-3 py-1 rounded-full mb-2">قهرمان NOVA</span>
            <h3 className="font-extrabold text-white text-lg">{topUsers[0]?.username || 'کاربر بدون نام'}</h3>
            <p className="text-amber-400 font-black text-2xl mt-1">{topUsers[0]?.nova_points || 0} PTS</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden order-3">
            <Medal className="w-8 h-8 text-amber-700 mb-2" />
            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full mb-2">رتبه ۳</span>
            <h3 className="font-bold text-white text-base">{topUsers[2]?.username || 'کاربر بدون نام'}</h3>
            <p className="text-cyan-400 font-extrabold text-lg mt-1">{topUsers[2]?.nova_points || 0} PTS</p>
          </div>
        </div>
      )}

      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            در حال دریافت لیدربورد...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-xs uppercase">
                <tr>
                  <th className="p-4 text-center">رتبه</th>
                  <th className="p-4">کاربر</th>
                  <th className="p-4">سطح (Level)</th>
                  <th className="p-4 text-left">امتیاز کل (NOVA Points)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {topUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 text-center font-bold">
                      {index === 0 && <span className="text-amber-400">🥇 1</span>}
                      {index === 1 && <span className="text-slate-300">🥈 2</span>}
                      {index === 2 && <span className="text-amber-600">🥉 3</span>}
                      {index > 2 && <span className="text-slate-500">#{index + 1}</span>}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white">{user.username || 'کاربر بدون نام'}</div>
                      <div className="text-xs text-slate-500">{user.email || user.id}</div>
                    </td>
                    <td className="p-4 text-slate-400 font-medium">Level {user.level || 1}</td>
                    <td className="p-4 text-left font-extrabold text-cyan-400">{user.nova_points || 0} PTS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}