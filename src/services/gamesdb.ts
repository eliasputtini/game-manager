export interface GamesDBGame {
  id: number;
  game_title: string;
  release_date: string;
  platform: number;
  region_id: number;
  country_id: number;
  developers: number[];
  // Enriched by our API route when include=boxart
  boxartUrl?: string;
}

export interface GamesDBResponse {
  code: number;
  status: string;
  data: {
    count: number;
    games: GamesDBGame[];
  };
  pages: {
    previous: string | null;
    current: string;
    next: string | null;
  };
  remaining_monthly_allowance: number;
  extra_allowance: number;
  allowance_refresh_timer: number;
}

export async function searchGamesByName(
  name: string,
  platform?: number,
  region?: number
): Promise<GamesDBGame[]> {
  try {
    const params = new URLSearchParams({
      name: name,
    });

    if (platform) {
      params.append('platform', platform.toString());
    }

    if (region) {
      params.append('region', region.toString());
    }

    // Request boxart by default
    params.append('include', 'boxart');

    const response = await fetch(
      `/api/games/search?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GamesDBResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(`API error: ${data.status}`);
    }

    return data.data.games || [];
  } catch (error) {
    console.error('Error fetching games from TheGamesDB:', error);
    throw error;
  }
}

// Helper function to convert GamesDB game to our Game interface
export function convertGamesDBToGame(gamesDBGame: GamesDBGame): import('../types').Game {
  const platformLabel = gamesDBGame.platform === 10 ? 'PS1' : gamesDBGame.platform === 11 ? 'PS2' : String(gamesDBGame.platform);
  return {
    id: gamesDBGame.id.toString(),
    title: gamesDBGame.game_title,
    description: `Released: ${gamesDBGame.release_date} | Platform: ${platformLabel}`,
    category: platformLabel,
    imageUrl: gamesDBGame.boxartUrl,
    game_title: gamesDBGame.game_title,
    release_date: gamesDBGame.release_date,
    platform: gamesDBGame.platform,
    region_id: gamesDBGame.region_id,
    country_id: gamesDBGame.country_id,
    developers: gamesDBGame.developers,
  };
}
