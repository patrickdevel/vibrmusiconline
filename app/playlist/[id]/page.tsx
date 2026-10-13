'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { usePlayer, Track } from '@/context/PlayerContext';
import { ArrowLeft, Play } from 'lucide-react';

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const kind = useSearchParams().get('kind') === 'album' ? 'album' : 'playlist';
  const router = useRouter();
  const { playTrack, setError } = usePlayer();
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/playlist?id=${encodeURIComponent(id)}&kind=${kind}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Fehler beim Laden');
        setTitle(data.title);
        setCover(data.cover);
        setTracks(data.tracks || []);
      })
      .catch((e) => setFailed(e.message))
      .finally(() => setLoading(false));
  }, [id, kind]);

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
        <ArrowLeft size={18} /> Zurück
      </button>

      {loading && <p className="text-gray-400">Lade...</p>}
      {failed && <p className="text-primary">{failed}</p>}

      {!loading && !failed && (
        <>
          <div className="flex items-center gap-5">
            {cover && <img src={cover} alt={title} referrerPolicy="no-referrer" className="w-32 h-32 rounded-xl object-cover" />}
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>

          {tracks.length === 0 && <p className="text-gray-400">Keine abspielbaren Songs gefunden.</p>}

          <div className="space-y-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                onClick={() => (track.kind === 'video' ? setError('Videos werden nicht unterstützt. Bitte wähle einen Song.') : playTrack(track))}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface/80 transition cursor-pointer group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img src={track.thumbnail} alt={track.title} referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{track.title}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {track.kind === 'video' && <span className="mr-2 px-1.5 py-0.5 rounded bg-secondary text-xs uppercase">Video</span>}
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
        </>
      )}
    </div>
  );
}
