'use client';

import { useState } from 'react';
import { Key } from 'lucide-react';

export default function LoginPage() {
  const [cookie, setCookie] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ytmusic_cookie', cookie);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">YouTube Music Login</h1>
        <p className="text-gray-400 mt-2">
          Um auf deine persönlichen Playlists zuzugreifen, kannst du hier deinen Cookie aus YouTube Music einfügen.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            YouTube Music Cookie
          </label>
          <textarea
            rows={5}
            value={cookie}
            onChange={(e) => setCookie(e.target.value)}
            placeholder="SAPISID=...; HSID=...;"
            className="w-full bg-surface text-white p-4 rounded-xl border border-secondary focus:outline-none focus:border-primary transition text-sm font-mono"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition"
        >
          <Key size={18} />
          <span>Cookie speichern</span>
        </button>

        {saved && <p className="text-green-400 text-sm">Cookie erfolgreich gespeichert!</p>}
      </form>
    </div>
  );
}
