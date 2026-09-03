// app/admin/rewards/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Gift, Plus, Trash2, Loader2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Reward {
  id: string;
  title: string;
  description: string;
  cost_points: number;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cost_points: 100,
    stock: 10,
  });

  const fetchRewards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('خطا در دریافت پاداش‌ها:', error.message);
    } else if (data) {
      setRewards(data as Reward[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('rewards').insert([
      {
        ...formData,
        is_active: true,
      },
    ]);

    if (error) {
      alert(`خطا در ایجاد پاداش: ${error.message}`);
    } else {
      setIsModalOpen(false);
      setFormData({ title: '', description: '', cost_points: 100, stock: 10 });
      fetchRewards();
    }
    setSubmitting(false);
  };

  const deleteReward = async (id: string) => {
    if (!confirm('آیا از حذف این پاداش اطمینان دارید؟')) return;

    const { error } = await supabase.from('rewards').delete().eq('id', id);

    if (error) {
      alert(`خطا در حذف پاداش: ${error.message}`);
    } else {
      setRewards((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            مدیریت پاداش‌ها (Rewards) <Gift className="w-5 h-5 text-purple-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            تعریف جوایزی که کاربران می‌توانند با امتیازهای خود Claim کنند
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all text-sm"
        >
          <Plus size={18} />
          ایجاد پاداش جدید
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          در حال بارگذاری لیست پاداش‌ها...
        </div>
      ) : rewards.length === 0 ? (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl text-center p-12 text-slate-500">
          پاداشی تعریف نشده است.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-purple-500/40 transition-all relative"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-white text-base">{reward.title}</h3>
                  <button
                    onClick={() => deleteReward(reward.id)}
                    className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-slate-400 text-xs mb-4">{reward.description || 'بدون توضیح'}</p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-800/80 pt-3">
                <span className="text-xs text-slate-500">موجودی: {reward.stock} عدد</span>
                <span className="text-purple-400 font-extrabold text-sm">{reward.cost_points} PTS</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <h2 className="text-lg font-bold text-white mb-4">ایجاد پاداش جدید</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">عنوان پاداش</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: NFT رایگان نسل اول"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">توضیحات</label>
                <input
                  type="text"
                  placeholder="توضیح کوتاه درباره پاداش..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">هزینه (NOVA Points)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.cost_points}
                    onChange={(e) => setFormData({ ...formData, cost_points: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-purple-400 font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">تعداد موجودی</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  ثبت پاداش
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}