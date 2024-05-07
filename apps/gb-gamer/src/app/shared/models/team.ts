export interface Team {
  name: string;
  authority: string;
  description: string | null;
  moto: string | null;
  country: string;
  avatar: string;
  contact: Contact;
  cover: string;
  game: Game;
  leader: Leader;
  members: Member[] | any;
  owner: Owner;
  short_link: string;
  social: any;
  is_joined: boolean;
  id: number;
  participant_name: string;
  reference_number: string;
}

interface Contact {
  email: string;
  phone: string;
}

interface Game {
  data: GameData;
}

interface GameData {
  id: number;
  name: string;
  code: string;
}

interface Leader {
  id: number;
  username: string;
  slug: string;
}

interface Member {
  id: number;
  slug: string;
  country: string;
  username: string;
  avatar: string;
  roles: string[];
  cover: string;
  reference_number: string;
}

interface Owner {
  id: number;
  username: string;
  slug: string;
}
