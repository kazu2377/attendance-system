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
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-10 bg-slate-50 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight">
          Attendance <span className="text-blue-600">Dashboard</span>
        </h1>
        <p className="text-slate-500 text-lg">Manage your work hours efficiently</p>
      </div>

      <div className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-md text-center border border-slate-100 transform transition-all hover:scale-105 duration-300">
        <div className="mb-8">
          <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-2">Current Status</p>
          <div className={`text-3xl font-bold ${status === 'Working' ? 'text-emerald-500' : 'text-slate-400'}`}>
            {status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAttendance('clock-in')}
            disabled={loading || status === 'Working'}
            className={`px-6 py-4 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-95 ${status === 'Working'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/30'
              }`}
          >
            Clock In
          </button>
          <button
            onClick={() => handleAttendance('clock-out')}
            disabled={loading || status === 'Idle'}
            className={`px-6 py-4 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-95 ${status === 'Idle'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 hover:shadow-rose-500/30'
              }`}
          >
            Clock Out
          </button>
        </div>

        {message && (
          <div className={`mt-6 p-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
