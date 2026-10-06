'use client';

import Link from 'next/link';
import { Home, Search, Library, User, Music } from 'lucide-react';

export const Navbar = () => {
  return (
    <aside className="w-64 bg-surface h-screen p-6 flex flex-col justify-between border-r border-secondary/20">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary rounded-xl text-white">
            <Music size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">M3Play Web</h1>
        </div>

        <nav className="space-y-2">
          <Link href="/" className="flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-secondary/50 rounded-xl transition">
            <Home size={20} />
            <span>Start</span>
          </Link>
          <Link href="/search" className="flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-secondary/50 rounded-xl transition">
            <Search size={20} />
            <span>Suchen</span>
          </Link>
          <Link href="/library" className="flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-secondary/50 rounded-xl transition">
            <Library size={20} />
            <span>Bibliothek</span>
          </Link>
        </nav>
      </div>

      <div>
        <Link href="/login" className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-secondary/50 rounded-xl transition">
          <User size={20} />
          <span>YouTube Login</span>
        </Link>
      </div>
    </aside>
  );
};
