import React from 'react';
import Link from 'next/link';

export default function SchoolLP() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-slate-100">
                <div className="text-2xl font-bold text-emerald-600">Sakura High</div>
                <div className="space-x-6 hidden md:block">
                    <Link href="#" className="hover:text-emerald-600 transition">About</Link>
                    <Link href="#" className="hover:text-emerald-600 transition">Academics</Link>
                    <Link href="#" className="hover:text-emerald-600 transition">Admissions</Link>
                    <Link href="#" className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition">Apply Now</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Placeholder for Hero Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-emerald-50 z-0">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#06C755 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6 tracking-wide">
                        2025 ADMISSIONS OPEN
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        Shape Your Future <br />
                        <span className="text-emerald-500">At Sakura High</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Experience a world-class education in a vibrant, modern environment designed to inspire the next generation of leaders.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="#" className="px-8 py-4 bg-emerald-500 text-white text-lg font-bold rounded-full shadow-lg hover:bg-emerald-600 hover:shadow-xl transition transform hover:-translate-y-1">
                            Request Brochure
                        </Link>
                        <Link href="#" className="px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition">
                            Virtual Tour
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose Us?</h2>
                        <p className="text-slate-500">Discover what makes our community unique.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: "Global Curriculum", desc: "International standards meeting local values.", icon: "🌏" },
                            { title: "Modern Facilities", desc: "State-of-the-art labs and creative spaces.", icon: "🏛️" },
                            { title: "Expert Faculty", desc: "Learn from industry leaders and passionate educators.", icon: "👨‍🏫" },
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition duration-300 border border-slate-100 hover:border-emerald-100 group">
                                <div className="text-4xl mb-6 group-hover:scale-110 transition duration-300">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Start Your Journey?</h2>
                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                        Join us for an open house event this Saturday and see the campus for yourself.
                    </p>
                    <Link href="#" className="inline-block px-10 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-400 transition shadow-lg hover:shadow-emerald-500/25">
                        Register for Open House
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                    <p>&copy; 2025 Sakura High School. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-emerald-600">Privacy</Link>
                        <Link href="#" className="hover:text-emerald-600">Terms</Link>
                        <Link href="#" className="hover:text-emerald-600">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
