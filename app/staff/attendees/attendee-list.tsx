'use client';

import { useState } from 'react';

type EventType = { id: string; title: string; capacity: number };
type RegistrationType = { 
  id: string; 
  eventId: string;
  fullName: string; 
  email: string; 
  mobile: string; 
  ticketCode: string; 
  status: string; 
  createdAt: string;
  checkedInAt: string | null;
};

export default function AttendeeList({ 
  events, 
  allRegistrations 
}: { 
  events: EventType[], 
  allRegistrations: RegistrationType[] 
}) {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Filter registrations by selected event
  const eventRegistrations = allRegistrations.filter(r => r.eventId === selectedEventId);
  
  // 2. Calculate Totals
  const selectedEvent = events.find(e => e.id === selectedEventId);
  const totalRegistered = eventRegistrations.filter(r => r.status === 'CONFIRMED' || r.status === 'CHECKED_IN').length;
  const totalCheckedIn = eventRegistrations.filter(r => r.status === 'CHECKED_IN').length;

  // 3. Apply Search Filter
  const filteredAttendees = eventRegistrations.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.ticketCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila'
    });
  };

  return (
    <div>
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end mb-6">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
          <select 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search (Name or Code)</label>
          <input 
            type="text" 
            placeholder="Search attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900"
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6 flex gap-8 text-blue-900 font-medium">
        <p>Registered: <span className="font-bold text-lg">{totalRegistered}</span> / {selectedEvent?.capacity || 0}</p>
        <p>Checked In: <span className="font-bold text-lg text-green-600">{totalCheckedIn}</span> / {totalRegistered}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAttendees.map((reg) => (
              <tr key={reg.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{reg.email}</div>
                  <div>{reg.mobile}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{reg.ticketCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(reg.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {reg.status === 'CHECKED_IN' ? (
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Checked In
                    </span>
                  ) : reg.status === 'CONFIRMED' ? (
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Confirmed
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {reg.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAttendees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No attendees found for this event.
          </div>
        )}
      </div>
    </div>
  );
}