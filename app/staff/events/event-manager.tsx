'use client';

import { useState } from 'react';
import { Plus, Edit2, CalendarDays, MapPin, X, Loader2 } from 'lucide-react';
import { createEvent, updateEvent } from '@/app/actions/events';

export default function EventManager({ initialEvents }: { initialEvents: any[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openCreate = () => {
    setEditingEvent(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (event: any) => {
    setEditingEvent(event);
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      venue: formData.get('venue'),
      startsAt: formData.get('startsAt'),
      endsAt: formData.get('endsAt'),
      capacity: formData.get('capacity'),
      status: formData.get('status'),
    };

    const res = editingEvent 
      ? await updateEvent(editingEvent.id, data)
      : await createEvent(data);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      window.location.reload(); // Refresh data from server
    }
  };

  // Helper to format datetime for the input field (YYYY-MM-DDThh:mm)
  const formatForInput = (dateStr: string) => {
    const d = new Date(dateStr);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-7 sm:pt-14 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 shadow-sm"><span className="size-1.5 rounded-full bg-blue-600" /> Management</div>
          <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.065em] text-slate-950 sm:text-[42px]">Events</h1>
          <p className="mt-2 text-sm text-slate-500">Create, edit, and manage your upcoming events.</p>
        </div>
        <button onClick={openCreate} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_6px_14px_-7px_rgba(37,99,235,0.9)] transition hover:bg-blue-700">
          <Plus className="size-4" /> Create Event
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_42px_-28px_rgba(15,23,42,0.2)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm text-slate-500">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              <tr>
                <th className="h-11 pl-5 font-bold">Event Name</th>
                <th className="font-bold">Date</th>
                <th className="font-bold">Capacity</th>
                <th className="font-bold">Status</th>
                <th className="pr-5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/60">
                  <td className="py-4 pl-5 text-[13px] font-semibold text-slate-800">{ev.title}</td>
                  <td className="text-xs font-medium text-slate-700">
                    {new Date(ev.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="text-xs font-medium text-slate-700">{ev.capacity} seats</td>
                  <td>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${ev.status === 'PUBLISHED' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="pr-5 text-right">
                    <button onClick={() => openEdit(ev)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                      <Edit2 className="size-3" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan={5} className="h-28 text-center text-sm text-slate-500">No events created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
              <X className="size-5" />
            </button>
            
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><CalendarDays className="size-5" /></span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
              </div>

              {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title</label>
                  <input name="title" defaultValue={editingEvent?.title} required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea name="description" defaultValue={editingEvent?.description} required rows={3} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Venue</label>
                  <input name="venue" defaultValue={editingEvent?.venue} required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                    <input type="datetime-local" name="startsAt" defaultValue={editingEvent ? formatForInput(editingEvent.startsAt) : ''} required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                    <input type="datetime-local" name="endsAt" defaultValue={editingEvent ? formatForInput(editingEvent.endsAt) : ''} required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity</label>
                    <input type="number" name="capacity" defaultValue={editingEvent?.capacity} min={1} required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                    <select name="status" defaultValue={editingEvent?.status || 'PUBLISHED'} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white">
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-[0_6px_14px_-7px_rgba(37,99,235,0.9)] transition disabled:opacity-50 flex justify-center items-center">
                  {loading ? <Loader2 className="size-5 animate-spin" /> : 'Save Event'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}