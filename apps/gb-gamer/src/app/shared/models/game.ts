export interface Game {
  allowed_brackets: string[];
  arenas_count: number;
  code: string;
  count: number;
  cover: string;
  covers:any;
  aw: string;
  profile_images:any;
  has_leaderboards: boolean;
  is_favorite: boolean;
  is_trackable: boolean;
  logo: string;
  logos:any;
  name: string;
  participants_count: number;
  platforms: Platform[];
  profile_image: string;
  icon: string;
  publisher_settings: any[]; // You can replace 'any' with a more specific type if available
  sm: string;
  tournaments_count: number;
  trackable_brackets: string[];
  versions: { data: any[] }; // You can replace 'any' with a more specific type if available
  recent_participants_count: number;
}

interface Platform {
  abbr: string;
  name: string;
  icon: string;
}
