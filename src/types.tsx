export interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string; // optional boxart or image URL
  // TheGamesDB API fields
  game_title?: string;
  release_date?: string;
  platform?: number;
  region_id?: number;
  country_id?: number;
  developers?: number[];
}

export type DraggedItem = Game;
