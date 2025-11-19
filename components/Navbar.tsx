import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Attendance MVP</Link>
                <div className="space-x-4">
                    <Link href="/" className="hover:text-gray-300">Dashboard</Link>
                    <Link href="/history" className="hover:text-gray-300">History</Link>
                </div>
            </div>
        </nav>
    );
}
