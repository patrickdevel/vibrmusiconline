import { NextResponse } from 'next/server';
import { getYouTube, mapItem } from '@/lib/ytmusic';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const kind = searchParams.get('kind') === 'album' ? 'album' : 'playlist';

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  try {
    const yt = await getYouTube();
    const data: any = kind === 'album' ? await yt.music.getAlbum(id) : await yt.music.getPlaylist(id.replace(/^VL/, ''));

    const header = data.header;
    const title = header?.title?.text || '';
    const headerThumbs = header?.thumbnails || header?.thumbnail?.contents || [];
    const cover = headerThumbs.length ? headerThumbs[headerThumbs.length - 1].url : '';

    const rawItems: any[] = kind === 'album' ? data.contents || [] : data.items || [];
    const albumArtist = header?.author?.name || header?.strapline_text_one?.text || '';

    const tracks = rawItems
      .map((raw) => {
        const item = mapItem(raw);
        if (!item) return null;
        // Alben-Tracks haben oft kein eigenes Cover/keinen Künstler
        if (!item.thumbnail) item.thumbnail = cover;
        if (item.artist === 'YouTube Music' && albumArtist) item.artist = albumArtist;
        return item;
      })
      .filter((t) => t && (t.kind === 'song' || t.kind === 'video'));

    return NextResponse.json({ title, cover, tracks });
  } catch (error) {
    console.error('Playlist error:', error);
    return NextResponse.json({ error: 'Playlist konnte nicht geladen werden.' }, { status: 500 });
  }
}
