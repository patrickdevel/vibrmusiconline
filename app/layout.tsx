import type { Metadata } from 'next';
import './globals.css';
import { PlayerProvider } from '@/context/PlayerContext';
import { Navbar } from '@/components/Navbar';
import { Player } from '@/components/Player';

export const metadata: Metadata = {
  title: 'M3Play Web',
  description: 'YouTube Music Web Player Client',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-background text-white min-h-screen flex antialiased">
        <PlayerProvider>
          <Navbar />
          <main className="flex-1 p-8 pb-32 overflow-y-auto h-screen">
            {children}
          </main>
          <Player />
        </PlayerProvider>
      </body>
    </html>
  );
}
