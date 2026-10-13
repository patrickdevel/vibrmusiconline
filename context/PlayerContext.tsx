'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  kind?: 'song' | 'video' | 'playlist' | 'album' | 'artist';
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  openItem: (item: Track) => void;
  error: string | null;
  setError: (msg: string | null) => void;
  togglePlay: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  volume: number;
  setVolume: (val: number) => void;
  progress: number;
  duration: number;
  seek: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const playTrack = (track: Track) => {
    // Videos werden nicht unterstützt – nur Audio-Songs
    if (track.kind === 'video') {
      setError('Videos werden nicht unterstützt. Bitte wähle einen Song.');
      return;
    }
    // Playlists, Alben und Künstler sind keine Audiospur
    if (track.kind && track.kind !== 'song') {
      setError('Das ist kein einzelner Song und kann nicht direkt abgespielt werden.');
      return;
    }
    setError(null);
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = `/api/stream?id=${encodeURIComponent(track.id)}`;
      audioRef.current.play().catch((e) => {
        if (e?.name !== 'AbortError') console.error(e);
      });
    }
  };

  // Playlists/Alben öffnen die Detailseite, Songs werden abgespielt
  const openItem = (item: Track) => {
    if (item.kind === 'playlist' || item.kind === 'album') {
      router.push(`/playlist/${encodeURIComponent(item.id)}?kind=${item.kind}`);
    } else {
      playTrack(item);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        openItem,
        error,
        setError,
        togglePlay,
        audioRef,
        volume,
        setVolume,
        progress,
        duration,
        seek,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          if (!audioRef.current?.src) return;
          setIsPlaying(false);
          setError('Dieser Titel konnte nicht geladen werden (evtl. ein Video oder nicht verfügbar).');
        }}
      />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
