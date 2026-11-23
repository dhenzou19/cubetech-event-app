'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { findTicket } from '@/app/actions/lookup';

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
      // Redirect to their actual ticket page
      router.push(`/tickets/${result.ticketCode}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Find My Ticket</h1>
          <p className="text-gray-500 mt-2">Enter your details to retrieve your QR code</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Code</label>
            <input 
              type="text" 
              name="ticketCode" 
              placeholder="e.g. TKT-A1B2C3"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 font-mono uppercase focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="juan@example.com"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find Ticket'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Events
          </Link>
        </div>
      </div>
    </main>
  );
}