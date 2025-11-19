import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Attendance MVP</Link>
                <div className="space-x-4">
                    <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                    <Link href="/history" className="text-gray-600 hover:text-gray-900">History</Link>
                    <Link href="/calendar" className="text-gray-600 hover:text-gray-900">Calendar</Link>
                </div>
            </div>
        </nav>
    );
}
