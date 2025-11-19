import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-slate-900/90 backdrop-blur-md text-white p-4 shadow-lg sticky top-0 z-50 border-b border-slate-800">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    Attendance System
                </Link>
                <div className="space-x-6">
                    <Link href="/" className="text-slate-300 hover:text-white transition-colors font-medium">Dashboard</Link>
                    <Link href="/history" className="text-slate-300 hover:text-white transition-colors font-medium">History</Link>
                    <Link href="/calendar" className="text-slate-300 hover:text-white transition-colors font-medium">Calendar</Link>
                </div>
            </div>
        </nav>
    );
}
