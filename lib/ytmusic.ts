import { Innertube } from 'youtubei.js';

let youtube: Innertube | null = null;
let creating: Promise<Innertube> | null = null;

export async function getYouTube(): Promise<Innertube> {
  if (youtube) return youtube;
  if (!creating) {
    creating = Innertube.create()
      .then((yt) => (youtube = yt))
      .finally(() => {
        creating = null;
      });
  }
  return creating;
}

export type ItemKind = 'song' | 'video' | 'playlist' | 'album' | 'artist';

export interface ApiItem {
  id: string;
  kind: ItemKind;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
}

function pickThumbnail(list: any[] | undefined): string {
  if (!list || !list.length) return '';
  // größtes Bild nehmen, Fallback: letztes
  const best = [...list].sort((a, b) => (b.width || 0) - (a.width || 0))[0] || list[list.length - 1];
  const url: string = best?.url || '';
  return url.startsWith('//') ? `https:${url}` : url;
}

const text = (v: any): string => (typeof v === 'string' ? v : v?.text || '');

/**
 * Wandelt ein youtubei.js-Item (MusicTwoRowItem / MusicResponsiveListItem)
 * in ein einheitliches Objekt um. Gibt null zurück, wenn das Item nicht darstellbar ist.
 */
export function mapItem(item: any): ApiItem | null {
  const type: string | undefined = item?.item_type;
  let kind: ItemKind;
  let id: string | undefined;

  switch (type) {
    case 'song':
    case 'video':
      kind = type;
      id = item.id || item.endpoint?.payload?.videoId;
      break;
    case 'playlist':
      kind = 'playlist';
      id = (item.id || item.endpoint?.payload?.browseId || '').replace(/^VL/, '');
      break;
    case 'album':
      kind = 'album';
      id = item.id || item.endpoint?.payload?.browseId;
      break;
    case 'artist':
      kind = 'artist';
      id = item.id || item.endpoint?.payload?.browseId;
      break;
    default:
      return null;
  }
  if (!id) return null;

  const title = text(item.title) || item.name || '';
  const artist =
    item.artists?.[0]?.name ||
    item.authors?.[0]?.name ||
    item.author?.name ||
    text(item.subtitle).split('•').pop()?.trim() ||
    'YouTube Music';
  const thumbs = Array.isArray(item.thumbnail) ? item.thumbnail : item.thumbnail?.contents || item.thumbnails;

  return {
    id,
    kind,
    title,
    artist,
    thumbnail: pickThumbnail(thumbs),
    duration: item.duration?.text || undefined,
  };
}
