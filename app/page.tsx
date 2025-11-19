'use client';

import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState<'Idle' | 'Working'>('Idle');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAttendance = async (action: 'clock-in' | 'clock-out') => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-1', action }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(action === 'clock-in' ? 'Working' : 'Idle');
        setMessage(action === 'clock-in' ? 'Clocked in successfully!' : 'Clocked out successfully!');
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Attendance Dashboard</h1>

      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md text-center">
        <p className="text-lg mb-4">Current Status: <span className={`font-bold ${status === 'Working' ? 'text-green-600' : 'text-gray-600'}`}>{status}</span></p>

        <div className="space-x-4">
          <button
            onClick={() => handleAttendance('clock-in')}
            disabled={loading || status === 'Working'}
            className={`px-6 py-3 rounded-md text-white font-semibold transition ${status === 'Working' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            Clock In
          </button>
          <button
            onClick={() => handleAttendance('clock-out')}
            disabled={loading || status === 'Idle'}
            className={`px-6 py-3 rounded-md text-white font-semibold transition ${status === 'Idle' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          >
            Clock Out
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
