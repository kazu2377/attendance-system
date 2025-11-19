import Calendar from '@/components/Calendar';

export default function CalendarPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Schedule & Attendance</h1>
                <p className="text-slate-500 mt-2">Manage your events and view your attendance history</p>
            </div>
            <Calendar />
        </div>
    );
}
