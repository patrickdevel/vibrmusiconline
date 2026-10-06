'use client';

import { Music } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bibliothek</h1>
      <p className="text-gray-400">Deine gespeicherten Playlists und Lieblingssongs.</p>

      <div className="p-12 border border-dashed border-secondary rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 bg-secondary/50 rounded-full text-gray-400">
          <Music size={32} />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Verbinde deinen YouTube-Account</h3>
          <p className="text-sm text-gray-400">Füge deinen Cookie unter "YouTube Login" ein, um Playlists zu sehen.</p>
        </div>
      </div>
    </div>
  );
}
