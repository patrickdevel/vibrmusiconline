'use client';

import { useEffect, useState } from 'react';
import { usePlayer, Track } from '@/context/PlayerContext';
import { Play } from 'lucide-react';

interface Section {
  title: string;
  items: Track[];
}

export default function HomePage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    fetch('/api/home')
      .then((res) => res.json())
      .then((data) => {
        setSections(data.sections || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-400">Lade Musik-Empfehlungen...</div>;
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-white">Willkommen bei M3Play</h1>
        <p className="text-gray-400 mt-1">Deine Lieblingsmusik direkt im Web streamen</p>
      </header>

      {sections.map((section, idx) => (
        <section key={idx} className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{section.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {section.items.map((item) => (
              <div
                key={item.id}
                onClick={() => playTrack(item)}
                className="bg-surface p-4 rounded-2xl hover:bg-secondary/60 transition group cursor-pointer relative border border-secondary/20"
              >
                <div className="relative mb-3 aspect-square rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="p-3 bg-primary rounded-full text-white shadow-lg">
                      <Play size={20} className="ml-0.5" />
                    </div>
                  </div>
                </div>
                <p className="font-medium text-white truncate">{item.title}</p>
                <p className="text-sm text-gray-400 truncate">{item.artist}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
