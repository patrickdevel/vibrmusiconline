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
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  try {
    const yt = await getYouTube();
    const info = await yt.getBasicInfo(id, 'WEB_REMIX');
    const format = info.chooseFormat({ type: 'audio', quality: 'best' });

    if (!format || !format.decipher(yt.session.player)) {
      return NextResponse.json({ error: 'Stream format not found' }, { status: 404 });
    }

    const url = format.decipher(yt.session.player);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json({ error: 'Failed to fetch stream' }, { status: 500 });
  }
}
