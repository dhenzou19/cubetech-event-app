'use client';

import { useState } from 'react';
import { processCheckIn } from '@/app/actions/checkin';

type EventType = { id: string; title: string };
type ResultType = { status: 'success' | 'already' | 'invalid'; name?: string; time?: string } | null;

export default function CheckInForm({ events }: { events: EventType[] }) {
  const [eventId, setEventId] = useState(events[0]?.id || '');
  const [ticketCode, setTicketCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCode.trim() || !eventId) return;

    setLoading(true);
    setResult(null);

    const response = await processCheckIn(eventId, ticketCode);
    
    setResult(response);
    setLoading(false);
    setTicketCode(''); // Clear input for next scan
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
          <select 
            value={eventId} 
            onChange={(e) => setEventId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Code</label>
          <input 
            type="text" 
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
            placeholder="e.g. TKT-A1B2C3"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 font-mono uppercase focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !ticketCode}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Check In'}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className={`p-6 rounded-xl border text-center ${
          result.status === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          result.status === 'already' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
          'bg-red-50 border-red-200 text-red-800'
        }`}>
          <h3 className="text-2xl font-bold mb-1">
            {result.status === 'success' && '✅ Checked In'}
            {result.status === 'already' && '⚠️ Already Checked In'}
            {result.status === 'invalid' && '❌ Invalid Ticket'}
          </h3>
          
          {result.status === 'success' && (
            <p className="text-lg font-medium">Welcome, {result.name}!</p>
          )}

          {result.status === 'already' && (
            <p>First checked in at: <strong>{result.time}</strong></p>
          )}

          {result.status === 'invalid' && (
            <p>Ticket code not found for this event.</p>
          )}
        </div>
      )}
    </div>
  );
}