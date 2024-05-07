export interface ArenaList {
  data: Arena[];
  meta:{
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;

  }
}

export interface Arena {
  categories: any[];
  category: string;
  authority: string;
  contact_info: null;
  country: null;
  cover_picture: string;
  description: string;
  arena_slug: string;
  email: string;
  followers: number;
  homepage_highlighted: boolean;
  id: number;
  is_custom: boolean;
  is_following: boolean;
  is_listed: boolean;
  is_organizer: boolean;
  is_trusted: boolean;
  is_verified: boolean;
  location: string;
  logo: string;
  mobile: string;
  name: string;
  no_of_participants: number;
  no_of_tournaments: number;
  no_of_challenges: number;
  organizer: {
    data: {
      username: string;
      // add other properties if available
    };
  };
  organizer_id: number;
  pinned_location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  posts: number;
  profile_picture: string;
  slogan: string;
  slug: string;
  social_media: {
    facebook: string;
    twitch: string;
    // add other social media platforms if available
  };
  tags: any[];

}

