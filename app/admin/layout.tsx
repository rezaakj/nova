// app/admin/layout.tsx
import AdminSidebar from '@/components/admin/Sidebar';

export const metadata = {
  title: 'NOVA Admin Panel',
  description: 'Management portal for NOVA project',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">پنل مدیریت NOVA</h2>
            <p className="text-slate-400 text-sm">کنترل کاربران، امتیازها و فعالیت‌ها</p>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
