'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Users,
  Coins,
  Rocket,
  Gift,
  FileText,
  Heart,
  Repeat2,
  CalendarCheck,
  RefreshCw,
  Activity,
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

interface Stats {
  users: number;
  points: number;
  activeTasks: number;
  claims: number;
  posts: number;
  likes: number;
  reposts: number;
  checkins: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    points: 0,
    activeTasks: 0,
    claims: 0,
    posts: 0,
    likes: 0,
    reposts: 0,
    checkins: 0,
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function loadStats() {
    setLoading(true);

    try {
      // تعداد کاربران
      const usersResult = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // مجموع NOVA Points
      const profilesResult = await supabase
        .from('profiles')
        .select('nova_points');

      // تعداد تسک‌ها / پست‌ها
      const postsResult = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      // Claimها
      const claimsResult = await supabase
        .from('post_claims')
        .select('*', { count: 'exact', head: true });

      // لایک‌ها
      const likesResult = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true });

      // Repostها
      const repostsResult = await supabase
        .from('post_reposts')
        .select('*', { count: 'exact', head: true });

      // Daily Check-in
      const checkinsResult = await supabase
        .from('daily_checkins')
        .select('*', { count: 'exact', head: true });

      // محاسبه مجموع NOVA Points
      const totalPoints =
        profilesResult.data?.reduce(
          (total, profile) => total + Number(profile.nova_points || 0),
          0
        ) || 0;

      setStats({
        users: usersResult.count || 0,
        points: totalPoints,
        activeTasks: postsResult.count || 0,
        claims: claimsResult.count || 0,
        posts: postsResult.count || 0,
        likes: likesResult.count || 0,
        reposts: repostsResult.count || 0,
        checkins: checkinsResult.count || 0,
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Admin stats error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();

    // بروزرسانی خودکار هر 30 ثانیه
    const interval = setInterval(() => {
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const statCards = [
    {
      title: 'کل کاربران',
      value: stats.users,
      icon: Users,
      description: 'کاربران ثبت‌نام‌شده',
    },
    {
      title: 'مجموع NOVA Points',
      value: stats.points,
      icon: Coins,
      description: 'موجودی فعلی کاربران',
    },
    {
      title: 'پست‌ها / تسک‌ها',
      value: stats.activeTasks,
      icon: Rocket,
      description: 'محتوای موجود در سیستم',
    },
    {
      title: 'درخواست‌های Claim',
      value: stats.claims,
      icon: Gift,
      description: 'Claimهای ثبت‌شده',
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Admin Dashboard
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            آمار واقعی سیستم NOVA
          </p>
        </div>

        <button
          onClick={loadStats}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />

          {loading ? 'در حال بروزرسانی...' : 'بروزرسانی'}
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group p-5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-slate-400 text-sm mb-2">
                    {stat.title}
                  </p>

                  <h3 className="text-2xl font-bold text-white">
                    {loading
                      ? '...'
                      : formatNumber(stat.value)}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2">
                    {stat.description}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/15 transition">
                  <Icon
                    size={20}
                    className="text-cyan-400"
                  />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-400" size={20} />

            <div>
              <p className="text-xs text-slate-500">
                کل پست‌ها
              </p>

              <p className="text-xl font-bold text-white">
                {formatNumber(stats.posts)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <Heart className="text-pink-400" size={20} />

            <div>
              <p className="text-xs text-slate-500">
                کل لایک‌ها
              </p>

              <p className="text-xl font-bold text-white">
                {formatNumber(stats.likes)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <Repeat2 className="text-blue-400" size={20} />

            <div>
              <p className="text-xs text-slate-500">
                کل Repostها
              </p>

              <p className="text-xl font-bold text-white">
                {formatNumber(stats.reposts)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <CalendarCheck className="text-green-400" size={20} />

            <div>
              <p className="text-xs text-slate-500">
                Daily Check-in
              </p>

              <p className="text-xl font-bold text-white">
                {formatNumber(stats.checkins)}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Activity */}
      <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800">

        <div className="flex items-center gap-3 mb-5">
          <Activity
            size={20}
            className="text-cyan-400"
          />

          <div>
            <h3 className="text-lg font-semibold text-white">
              وضعیت سیستم
            </h3>

            <p className="text-xs text-slate-500">
              اطلاعات زنده از Supabase
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="rounded-lg bg-slate-900/70 border border-slate-800 p-4">
            <p className="text-xs text-slate-500">
              وضعیت دیتابیس
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

              <span className="text-sm text-green-400">
                Connected
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-slate-900/70 border border-slate-800 p-4">
            <p className="text-xs text-slate-500">
              بروزرسانی خودکار
            </p>

            <p className="text-sm text-white mt-2">
              هر 30 ثانیه
            </p>
          </div>

          <div className="rounded-lg bg-slate-900/70 border border-slate-800 p-4">
            <p className="text-xs text-slate-500">
              آخرین بروزرسانی
            </p>

            <p className="text-sm text-white mt-2">
              {lastUpdated
                ? lastUpdated.toLocaleTimeString('fa-IR')
                : 'در حال دریافت...'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}