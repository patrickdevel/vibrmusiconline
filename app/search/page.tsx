'use client';

import { useState } from 'react';
import { usePlayer, Track } from '@/context/PlayerContext';
import { Search as SearchIcon, Play } from 'lucide-react';

const KIND_LABEL: Record<string, string> = { video: 'Video', playlist: 'Playlist', album: 'Album', artist: 'Künstler' };

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { openItem } = usePlayer();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Suche</h1>

      <form onSubmit={handleSearch} className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Songs, Künstler oder Alben suchen..."
          className="w-full bg-surface text-white pl-12 pr-4 py-4 rounded-2xl border border-secondary focus:outline-none focus:border-primary transition"
        />
      </form>

      {loading && <p className="text-gray-400">Suchen...</p>}

      <div className="space-y-2">
        {results.map((track) => (
          <div
            key={track.id}
            onClick={() => openItem(track)}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-surface/80 transition cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <img src={track.thumbnail} alt={track.title} referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <p className="font-medium text-white">{track.title}</p>
                <p className="text-sm text-gray-400">
                  {track.kind && track.kind !== 'song' && (
                    <span className="mr-2 px-1.5 py-0.5 rounded bg-secondary text-xs uppercase">{KIND_LABEL[track.kind]}</span>
                  )}
                  {track.artist}
                </p>
              </div>
            </div>
            <button className="p-2 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-full transition">
              <Play size={18} className="ml-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
