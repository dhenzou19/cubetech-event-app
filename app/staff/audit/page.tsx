import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AuditPage() {
  const session = await verifyStaffSession();
  if (!session) redirect('/staff/login');

  const logs = await db.orm.public.AuditLog.where({}).all();
  // Sort newest first
  logs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila'
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-7 sm:pt-14 lg:px-10">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 shadow-sm">
          <ShieldAlert className="size-3.5" /> Security
        </div>
        <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.065em] text-slate-950 sm:text-[42px]">Audit Log</h1>
        <p className="mt-2 text-sm text-slate-500">A chronological record of all staff actions and system events.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_42px_-28px_rgba(15,23,42,0.2)]">
        <table className="w-full text-left text-sm text-slate-500">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="h-11 pl-5 font-bold">Date & Time</th>
              <th className="font-bold">Action</th>
              <th className="font-bold">Details</th>
              <th className="pr-5 font-bold text-right">Performed By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log: any) => (
              <tr key={log.id} className="hover:bg-slate-50/60">
                <td className="py-4 pl-5 text-xs text-slate-500 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                <td className="py-4">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                    {log.action}
                  </span>
                </td>
                <td className="py-4 text-[13px] text-slate-800">{log.details}</td>
                <td className="py-4 pr-5 text-right text-xs font-medium text-slate-600">{log.staffName}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={4} className="h-28 text-center text-sm text-slate-500">No actions logged yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}