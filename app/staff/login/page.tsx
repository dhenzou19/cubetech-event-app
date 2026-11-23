'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginStaff } from '@/app/actions/auth';
import Link from 'next/link';

export default function StaffLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await loginStaff(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Redirect to the check-in dashboard upon success
      router.push('/staff/checkin');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Staff Login</h1>
          <p className="text-gray-500 mt-2">Sign in to manage event check-ins</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              name="username" 
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            &larr; Back to Attendee Site
          </Link>
        </div>
      </div>
    </main>
  );
}