'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, ShieldAlert, Award, UserCheck, Loader2, Edit3, Check, X } from 'lucide-react';

const supabase = createClient(
  'https://marfjuozuapydfdmcybv.supabase.co',
  'sb_publishable_ZVfB67bxvtRdTtabTSfW_Q_HiNPfsSK'
);

interface UserProfile {
  id: string;
  username: string;
  email: string;
  nova_points: number;
  level: number;
  role: 'admin' | 'user';
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPoints, setNewPoints] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('خطا در دریافت لیست کاربران:', error.message);
    } else if (data) {
      setUsers(data as UserProfile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdatePoints = async (userId: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ nova_points: newPoints })
      .eq('id', userId);

    if (error) {
      alert(`خطا در به‌روزرسانی امتیاز: ${error.message}`);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, nova_points: newPoints } : u))
      );
      setEditingUserId(null);
    }
    setSaving(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            مدیریت کاربران NOVA <UserCheck className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            مشاهده، جستجو و تغییر امتیاز و سطح دسترسی کاربران
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام، ایمیل یا ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            در حال دریافت اطلاعات کاربران...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12 text-slate-500">کاربری یافت نشد.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-xs uppercase">
                <tr>
                  <th className="p-4">کاربر</th>
                  <th className="p-4">نقش (Role)</th>
                  <th className="p-4">سطح (Level)</th>
                  <th className="p-4">امتیاز (NOVA Points)</th>
                  <th className="p-4">تاریخ عضویت</th>
                  <th className="p-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{user.username || 'کاربر بدون نام'}</div>
                      <div className="text-xs text-slate-500">{user.email || user.id}</div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {user.role === 'admin' && <ShieldAlert size={12} />}
                        {user.role === 'admin' ? 'ادمین' : 'کاربر عادی'}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <Award size={14} className="text-amber-400" />
                        Level {user.level || 1}
                      </span>
                    </td>

                    <td className="p-4">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={newPoints}
                            onChange={(e) => setNewPoints(Number(e.target.value))}
                            className="w-24 bg-slate-900 border border-cyan-500 rounded px-2 py-1 text-xs text-cyan-400 font-bold focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdatePoints(user.id)}
                            disabled={saving}
                            className="p-1 bg-cyan-500 text-slate-950 rounded hover:bg-cyan-400"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="p-1 bg-slate-800 text-slate-400 rounded hover:text-white"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-cyan-400">{user.nova_points || 0} PTS</span>
                      )}
                    </td>

                    <td className="p-4 text-xs text-slate-500">
                      {new Date(user.created_at).toLocaleDateString('fa-IR')}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setEditingUserId(user.id);
                          setNewPoints(user.nova_points || 0);
                        }}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-all"
                        title="ویرایش امتیاز"
                      >
                        <Edit3 size={16} />
                      </button>
                    </td>
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
