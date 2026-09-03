'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Twitter, 
  Send, 
  Globe, 
  Sparkles,
  Loader2 
} from 'lucide-react';

const supabase = createClient(
  'https://marfjuozuapydfdmcybv.supabase.co',
  'sb_publishable_ZVfB67bxvtRdTtabTSfW_Q_HiNPfsSK'
);

interface Task {
  id: string;
  title: string;
  platform: 'x' | 'telegram' | 'discord' | 'other';
  task_type: 'follow' | 'retweet' | 'join_channel' | 'like' | 'visit';
  target_url: string;
  reward_points: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    platform: 'x' as 'x' | 'telegram' | 'discord' | 'other',
    task_type: 'follow' as 'follow' | 'retweet' | 'join_channel' | 'like' | 'visit',
    target_url: '',
    reward_points: 50,
  });

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('خطا در دریافت تسک‌ها:', error.message);
    } else if (data) {
      setTasks(data as Task[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'reward_points' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('tasks').insert([
      {
        ...formData,
        is_active: true,
      },
    ]);

    if (error) {
      alert(`خطا در ذخیره تسک: ${error.message}`);
    } else {
      setIsModalOpen(false);
      setFormData({
        title: '',
        platform: 'x',
        task_type: 'follow',
        target_url: '',
        reward_points: 50,
      });
      fetchTasks();
    }
    setSubmitting(false);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      alert(`خطا در تغییر وضعیت: ${error.message}`);
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_active: !currentStatus } : t))
      );
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('آیا از حذف این تسک اطمینان دارید؟')) return;

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      alert(`خطا در حذف تسک: ${error.message}`);
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'x':
        return <Twitter className="w-4 h-4 text-sky-400" />;
      case 'telegram':
        return <Send className="w-4 h-4 text-cyan-400" />;
      default:
        return <Globe className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            مدیریت Social Tasks <Sparkles className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            تعریف کمپین‌های شبکه اجتماعی جدید برای پاداش‌دهی NOVA Points به کاربران
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all text-sm"
        >
          <Plus size={18} />
          ایجاد تسک جدید
        </button>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            در حال بارگذاری تسک‌ها...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-12 text-slate-500">
            هیچ تسکی ثبت نشده است. اولین تسک خود را اضافه کنید.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-xs uppercase">
                <tr>
                  <th className="p-4">عنوان تسک</th>
                  <th className="p-4">پلتفرم</th>
                  <th className="p-4">نوع اکشن</th>
                  <th className="p-4">امتیاز (NOVA Points)</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-medium text-white flex items-center gap-2">
                      {task.title}
                      <a
                        href={task.target_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs">
                        {getPlatformIcon(task.platform)}
                        {task.platform === 'x' ? 'X (توییتر)' : task.platform === 'telegram' ? 'تلگرام' : 'سایر'}
                      </span>
                    </td>
                    <td className="p-4 capitalize text-slate-400">{task.task_type}</td>
                    <td className="p-4 font-bold text-cyan-400">+{task.reward_points} PTS</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleStatus(task.id, task.is_active)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          task.is_active
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
                        }`}
                      >
                        {task.is_active ? (
                          <>
                            <CheckCircle size={12} /> فعال
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> غیرفعال
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-all"
                        title="حذف تسک"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
            <h2 className="text-lg font-bold text-white mb-4">ایجاد تسک جدید</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">عنوان تسک</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="مثال: کانال تلگرام NOVA را دنبال کنید"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">پلتفرم</label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="x">X (توییتر)</option>
                    <option value="telegram">تلگرام</option>
                    <option value="discord">دیسکورد</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">نوع اکشن</label>
                  <select
                    name="task_type"
                    value={formData.task_type}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="follow">Follow</option>
                    <option value="retweet">Retweet</option>
                    <option value="join_channel">Join Channel</option>
                    <option value="like">Like</option>
                    <option value="visit">Visit Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">لینک هدف (URL)</label>
                <input
                  type="url"
                  name="target_url"
                  required
                  placeholder="https://t.me/..."
                  value={formData.target_url}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">پاداش (NOVA Points)</label>
                <input
                  type="number"
                  name="reward_points"
                  required
                  min={1}
                  value={formData.reward_points}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  ذخیره و انتشار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}