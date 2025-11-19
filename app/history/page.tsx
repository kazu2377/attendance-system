'use client';

import { useEffect, useState } from 'react';

interface Record {
    id: number;
    date: string;
    startTime: string;
    endTime: string | null;
    status: string;
}

export default function History() {
    const [records, setRecords] = useState<Record[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/attendance');
                if (res.ok) {
                    const data = await res.json();
                    setRecords(data);
                }
            } catch (error) {
                console.error('Failed to fetch history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Attendance History</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {records.map((record) => (
                            <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(record.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.startTime).toLocaleTimeString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.endTime ? new Date(record.endTime).toLocaleTimeString() : '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
