import { NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';

let youtube: Innertube | null = null;

async function getYouTube() {
  if (!youtube) {
    youtube = await Innertube.create();
  }
  return youtube;
}

export async function GET() {
  try {
    const yt = await getYouTube();
    const homeFeed = await yt.music.getHomeFeed();
    
    const sections = homeFeed.sections?.map((section: any) => ({
      title: section.title?.text || 'Empfehlungen',
      items: section.contents?.map((item: any) => ({
        id: item.id,
        title: item.title?.text || item.title || '',
        artist: item.authors?.[0]?.name || item.subtitle?.text || 'YouTube Music',
        thumbnail: item.thumbnails?.[0]?.url || '',
      })).filter((i: any) => i.id) || []
    })) || [];

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Home feed error:', error);
    return NextResponse.json({ sections: [] });
  }
}
