'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerAttendee } from '@/app/actions/register';

export default function RegisterForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setServerError('');

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const mobile = formData.get('mobile') as string;

    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.fullName = 'Full name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email';

    const mobileRegex = /^09\d{9}$/;
    if (!mobileRegex.test(mobile)) newErrors.mobile = 'Must be 11 digits starting with 09';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const result = await registerAttendee({ eventId, fullName, email, mobile });

    if (result.error) {
      setServerError(result.error);
      setLoading(false);
    } else if (result.ticketCode) {
      router.push(`/tickets/${result.ticketCode}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
        <input 
          type="text" 
          name="fullName" 
          className="w-full border border-slate-200 bg-white rounded-xl p-3 text-slate-900 shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
          placeholder="Juan Dela Cruz"
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
        <input 
          type="email" 
          name="email" 
          className="w-full border border-slate-200 bg-white rounded-xl p-3 text-slate-900 shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
          placeholder="juan@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number</label>
        <input 
          type="text" 
          name="mobile" 
          className="w-full border border-slate-200 bg-white rounded-xl p-3 text-slate-900 shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
          placeholder="09171234567"
        />
        {errors.mobile && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.mobile}</p>}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_6px_14px_-7px_rgba(37,99,235,0.9)] transition active:scale-[0.99] disabled:opacity-50 mt-2"
      >
        {loading ? 'Processing...' : 'Register Now'}
      </button>
    </form>
  );
}