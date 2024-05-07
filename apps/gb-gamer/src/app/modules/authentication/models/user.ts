export interface User {
  avatar: string;
  bio: string;
  birthdate: number;
  phone: string;
  contact_details: {
    facebook: string | null;
    twitch: string | null;
    discord: string | null;
    twitter: string | null;
  };
  original: {
    id: number;
    participant_name: string;
    avatar: string;
    border: null | string; // 'null' or a string value
    border_id: null | string; // 'null' or a string value
    country: string;
    cover_picture: string
    slug: string
  },
  roles: [];
  country: string;
  current_timezone: string;
  gender: string;
  id: number;
  has_password: boolean;
  is_subscribed: boolean;
  language: string;
  name: string;
  permission: boolean;
  reference_number: string;
  slug: string;
  timezone: string;
  timezone_verified: boolean;
  username: string;
  cover_picture: string;
  username_changes_count: number;
  verified: number;
  email: string;
  is_premium: boolean;
  username_changed_at: string;
}
