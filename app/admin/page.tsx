// app/admin/page.tsx
export default function AdminDashboardPage() {
  const stats = [
    { title: 'کل کاربران', value: '1,240', change: '+12% این هفته' },
    { title: 'امتیازات توزیع‌شده (NOVA Points)', value: '450,000', change: '+25K امروز' },
    { title: 'تسک‌های فعال (Social Tasks)', value: '8', change: '3 تسک X / 5 تلگرام' },
    { title: 'درخواست‌های Claim پاداش', value: '42', change: 'نیاز به بررسی' },
  ];

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-all"
          >
            <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
            <span className="text-xs text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-800/40">
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions / Activity Feed placeholder */}
      <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4">آخرین فعالیت‌های سیستم</h3>
        <div className="text-slate-400 text-sm">
          داده‌های مربوط به Supabase پس از اتصال دیتابیس در اینجا نمایش داده می‌شوند.
        </div>
      </div>
    </div>
  );
}
