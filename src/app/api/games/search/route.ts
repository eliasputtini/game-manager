import { NextRequest, NextResponse } from 'next/server';

const GAMES_DB_API_KEY = 'ae1ab009fcfaaea637faf8c11efadc0dfa1ac0f9fe86c86e2b0031728b9873e2';
const GAMES_DB_BASE_URL = 'https://api.thegamesdb.net/v1.1';

// Minimal types to handle the parts of TheGamesDB response we consume
type BoxartFile = {
  side?: 'front' | 'back' | string;
  type?: 'boxart' | string;
  filename?: string;
  file?: string;
};

type IncludeBoxart = {
  base_url?: {
    original?: string;
    medium?: string;
  };
  data?: Record<string, BoxartFile[]>; // keys are game IDs as strings
};

type GamesDBGame = {
  id: number;
  // other fields omitted
};

type APIResponse = {
  code: number;
  status: string;
  data: {
    games: GamesDBGame[];
    base_url?: {
      original?: string;
      medium?: string;
    };
    boxart?: Record<string, BoxartFile[]>;
  };
  include?: {
    boxart?: IncludeBoxart;
  };
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  const platform = searchParams.get('platform');
  const include = searchParams.get('include') || 'boxart';
  const region = searchParams.get('region');

  // Require name for search route
  if (!name) {
    return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      apikey: GAMES_DB_API_KEY,
      name: name,
      include, // e.g., 'boxart' or 'boxart,platform'
    });

    if (platform) {
      params.append('filter[platform]', platform);
    }
    if (region) {
      params.append('filter[region_id]', region);
    }

    const response = await fetch(
      `${GAMES_DB_BASE_URL}/Games/ByGameName?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: APIResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(`API error: ${data.status}`);
    }

    // If boxart is included, try to compute a boxartUrl per game for convenience
    try {
      if (include.includes('boxart') && data?.data?.games && data?.include?.boxart) {
        // Prefer medium-sized images when available, otherwise fall back to original
        const baseObj = data?.include?.boxart?.base_url || data?.data?.base_url || {};
        const base = baseObj.medium || baseObj.original || '';
        const filesById: Record<string, BoxartFile[]> =
          data?.include?.boxart?.data || data?.data?.boxart || {};
        const gamesWithArt = data.data.games.map((g: GamesDBGame) => {
          let boxartUrl: string | undefined;
          const key = String(g.id);
          const files = filesById?.[key];
          if (files && Array.isArray(files) && base) {
            // Prefer front side, then any 'boxart' type, then the first available
            const front = files.find((f: BoxartFile) => f.side === 'front');
            const anyBox = files.find((f: BoxartFile) => f.type === 'boxart');
            const chosen = front || anyBox || files[0];
            const file = chosen?.filename || chosen?.file;
            if (file) {
              const normalizedBase = base.endsWith('/') ? base : base + '/';
              const normalizedFile = String(file).startsWith('/') ? String(file).slice(1) : String(file);
              boxartUrl = normalizedBase + normalizedFile;
            }
          }
          return { ...g, boxartUrl };
        });
        data.data.games = gamesWithArt;
      }
    } catch (e) {
      // If shape differs, just ignore and return the raw payload
      console.warn('Could not attach boxartUrl to games:', e);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching games from TheGamesDB:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
