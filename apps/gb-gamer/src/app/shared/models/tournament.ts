import {Arena} from "./arena";

interface Tree {
  data: TreeData[];
}

interface TreeData {
  id: number;
  type: string;
  is_published: number;
  is_hidden: null | boolean;
  group_settings: null;
  publisher_settings: null;
}

export interface Tournament {
  arena: Arena
  cover_pictures: any;
  profile_pictures: any;
  arena_avatar: string;
  arena_id: number;
  arena_name: string;
  arena_slug: string;
  code: string;
  coins: number;
  count_confirmed: number;
  count_pending: number;
  cover_picture: string;
  description: string;
  total_no_of_participants_per_team: number
  general_rules: string;
  is_premium: boolean;
  contact_details: {
    facebook: string | null;
    twitch: string | null;
    email: string | null;
    discord: string | null;
    twitter: string | null;
    phone: string | null;
    website: string | null;
    instagram: string | null;
  };
  game: {
    data: {
      id: number;
      name: string;
      code: string;
      icon: string;
      profile: string;
      cover: string;
      aw: string;
      logo: string;
    }
  };
  game_settings: []
  game_mode: number;
  guaranteed_prizes: boolean;
  hasTree: boolean;
  has_joinCodes: string | null;
  has_started: boolean | null;
  has_third_place: boolean;
  hashtags: string | null;
  hide_participants: boolean | null;
  homepage_highlighted: boolean;
  id: number;
  is_featured: boolean | null;
  is_trackable: boolean | null;
  isJoined: boolean | null;
  join_privacy: string;
  check_in_open: boolean;
  participants_must_check_in: boolean;
  has_checked_in: boolean;
  leaderboard_auto_calculate: boolean;
  leaderboard_template: string | null;
  location: string | null;
  name: string;
  no_of_participants_per_team: number;
  no_participants_per_team: number;
  no_of_substitutes_per_team: number;
  number_participants: number;
  organizer: {
    id: number;
    name: string;
    username: string;
    slug: string;
    avatar: string;
    cover: string;
  };
  participants_type: string;
  pending_message: string;
  pinned_location: string | null;
  required_accounts: [];
  platformSlug: string;
  prizes: any[] | null; // Replace 'any' with a specific type if known
  supportedRequiredInputsKeys: any[];
  profile_picture: string;
  registration_status: string;
  required_inputs_keys: string[] | null;
  show_pending: boolean;
  show_products: boolean;
  show_rules: boolean;
  size: number;
  start_at: string;
  start_at_date: string;
  stage_type: string;
  check_in_date: number;
  check_in_margin: number;
  start_at_timestamp: string;
  status: string;
  team_edit_open: boolean;
  timezone: string;
  total_participants_count: number;
  type: string;
  visibility: string;
  tree: Tree
  teamMembersSupportedRequiredInputsKeys: string[] | null;
  connected_accounts_required: boolean
  members_connected_accounts_required: boolean
}

export interface TournamentList {
  data: Tournament[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  }
}
