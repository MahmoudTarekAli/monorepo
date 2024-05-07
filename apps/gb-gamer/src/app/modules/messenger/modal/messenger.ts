import {User} from "../../authentication/models/user";

export interface chatbox {
  show: boolean,
  chat: Chat
}

export interface Chat {
  admins: number[];
  avatar: string;
  code: string;
  created_at: string | null;
  id: string;
  last_message: {
    body: string;
    sender: number;
    author: string;
    created_at: any;
  };
  loading: boolean;
  members: number[];
  messages: any[]; // You can define a separate interface for messages if needed
  name: string | null;
  panel: boolean;
  readBy: any[]; // You can define a separate interface for readBy if needed
  tournament_code: string;
  type: string;
  updated_at: number | null;
  view: number[];
}

export interface ChatMessage {
  author: string;
  body: string;
  created_at: number;
  sender: number;
}
