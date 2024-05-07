import {Game} from "./game";
import {Arena} from "./arena";
interface Points {
  check_in_points: number;
  rank_points: number[];
  match_winner: number;
}
export interface Leaderboard {
  data: any[]; // Update the type accordingly if you have more information
  arena: Arena;
  event: any;
  game: Game;
  aw: string;
  code: string;
  count: number;
  cover: string;
  default_bracket_type: string;
  id: number;
  logo: string;
  name: string;
  opposition_type: null; // Update the type accordingly if you have more information
  platformSlug: {
    name: {
      id: number;
      abbr: string;
      name: string;
      icon: string;
      created_at: string | null;
      updated_at: string | null;
      // other properties...
    };
    // other properties...
  }[];
  profile_image: string;
  sm: string;
  versions: {
    data: any[]; // Update the type accordingly if you have more information
  };
  guaranteed_tournaments: boolean;
  is_active: boolean;
  listed_tournaments: boolean;
  points: Points;
  prizes: null; // Update the type accordingly if you have more information
  tournaments_count: number;
  type: string;
  total: number;
}
export interface LeaderboardPoints {
  leaderboard: Leaderboard;
  leaderboard_points: {
    points: number;
    winner: {
      avatar: string;
      country: string;
      id: number;
      reference_number: string;
      slug: string;
      username: string; };
  }[];
  current_page: number;
  total: number;
}
