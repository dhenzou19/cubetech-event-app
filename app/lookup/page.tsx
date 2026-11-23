'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { findTicket } from '@/app/actions/lookup';
import { ArrowLeft, Search } from 'lucide-react';

export default function LookupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const ticketCode = formData.get('ticketCode') as string;
    const email = formData.get('email') as string;

    const result = await findTicket(ticketCode, email);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success) {
      router.push(`/tickets/${result.ticketCode}`);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4">
      <div className="hero-glow pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2" aria-hidden="true" />
      
      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl shadow-[0_8px_30px_-16px_rgba(15,23,42,0.2)] p-8 sm:p-10 border border-slate-200/80">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Search className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Find My Ticket</h1>
          <p className="text-slate-500 mt-2 text-sm">Enter your details to retrieve your QR code</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ticket Code</label>
            <input 
              type="text" 
              name="ticketCode" 
              placeholder="e.g. TKT-A1B2C3"
              className="w-full border border-slate-200 bg-white rounded-xl p-3 text-slate-900 font-mono uppercase shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="juan@example.com"
              className="w-full border border-slate-200 bg-white rounded-xl p-3 text-slate-900 shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_6px_14px_-7px_rgba(37,99,235,0.9)] transition active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {loading ? 'Searching...' : 'Find Ticket'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition">
            <ArrowLeft className="size-4" /> Back to Events
          </Link>
        </div>
      </div>
    </main>
  );
}