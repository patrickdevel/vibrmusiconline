import { NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';

let youtube: Innertube | null = null;

async function getYouTube() {
  if (!youtube) {
    youtube = await Innertube.create();
  }
  return youtube;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const yt = await getYouTube();
    const searchResults = await yt.music.search(q, { type: 'song' });
    
    const results = searchResults.songs?.contents.map((song: any) => ({
      id: song.id,
      title: song.title,
      artist: song.artists?.[0]?.name || 'Unbekannt',
      thumbnail: song.thumbnails?.[0]?.url || '',
      duration: song.duration?.text || '',
    })) || [];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
