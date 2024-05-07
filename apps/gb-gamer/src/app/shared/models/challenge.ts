
export interface Challenge {
  banner: string;
  description: string;
  end_date: string;
  required_inputs: any;
  password_type: string;
  is_premium: boolean;
  isOwner: boolean;
  is_featured: boolean;
  game: {
    name: string;
    code: string;
    count: number;
    profile_image:string;
    logo:string;
    cover:string;
    icon: string;
    // Add more properties if needed
  };
  arena:{
    id: string;
    name: string;
    description: string;
    type: string;
    cover: string;
    logo: string;
    profile_image: string;
  }
  has_password: boolean;
  icon: string;
  id: string;
  name: string;
  password: null | string;
  prize_pool: number;
  prizes: {
    from: number;
    to: number;
    prizes: {
      type: string;
      value: number;
      currency: null | string;
      note: null | string;
    }[];
  }[];
  rules: string;
  settings: {
    allowed_modes: string[];
    must_win_the_game: boolean;
    game_id: number;
    type: string;
    // Add more properties if needed
  };
  start_at: string;
  status: string;
  total_participants_count: number;
  total_prizes: number;
  type: string;
  visibility: string;
}
export interface ChallengeList {
  data: Challenge[];
  meta:Meta
  links: any
}
export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  total: number;

}
