export interface GamerProfile {
  avatar: string;
  badges: string[];
  bio: string;
  birthdate: number;
  border: null;
  friendship_request: {
    hasFriendRequestFrom: boolean;
    hasSentFriendRequestTo: boolean;
    friendRequestID: number | null;
  }

  contact_details: {
    facebook: string;
    twitch: null;
    discord: null;
    twitter: null;
  };
  country: string;
  cover_picture: string;
  gender: string;
  joined_challenges_count: number;
  name: string;
  preferences: {
    _id: number;
    game_name: string;
    // Add any additional properties if available
  }[];
  reference_number: string;
  slug: string;
  timezone: string;
  title: null;
  username: string;
  _id: number;
  is_premium: boolean;
}
