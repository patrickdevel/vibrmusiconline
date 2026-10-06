'use client';

import { usePlayer } from '@/context/PlayerContext';
import { Play, Pause, Volume2 } from 'lucide-react';

export const Player = () => {
  const { currentTrack, isPlaying, togglePlay, progress, duration, seek, volume, setVolume } = usePlayer();

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-surface/95 backdrop-blur-md border-t border-secondary/30 px-6 flex items-center justify-between z-50">
      <div className="flex items-center gap-4 w-1/4">
        <img
          src={currentTrack.thumbnail}
          alt={currentTrack.title}
          referrerPolicy="no-referrer"
          className="w-14 h-14 rounded-lg object-cover shadow-md"
        />
        <div className="overflow-hidden">
          <p className="text-white font-medium truncate">{currentTrack.title}</p>
          <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-2/4">
        <button
          onClick={togglePlay}
          className="p-3 bg-primary text-white rounded-full hover:scale-105 transition"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>

        <div className="flex items-center gap-3 w-full max-w-md text-xs text-gray-400">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-1/4 justify-end">
        <Volume2 size={18} className="text-gray-400" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};
