export type Gender = 'Male' | 'Female';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  distance: string; // e.g., "1.1km"
  location: string; // e.g., "Kenya"
  images: string[];
  online: boolean;
  status: string; // "humble girl" or custom status
  personalitySimilarity: number; // e.g., 89
  aboutMe: {
    active: string; // "Active" | "Inactive"
    education: string; // "In college" | "Graduate" | etc
    socialness: string; // "Socially" | "Reserved"
    worldView: string; // "World Peace" | etc
    alcohol: string; // "No" | "Yes" | "Occasionally"
    sign: string; // "Gemini" | "Leo" | etc
  };
  hobbies: string[]; // ["Design", "Dancing", "Netball"]
  truthsAndLie: {
    truths: string[];
    lie: string;
  };
  alwaysSays: string; // e.g., "thankyou"
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  status?: 'sending' | 'sent' | 'read';
}

export interface ChatSession {
  userId: string;
  lastMessage: string;
  lastActive: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface MomentPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorAge: number;
  authorGender: Gender;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  hasLiked?: boolean;
  isUserPost?: boolean;
}

export interface CoinPackage {
  id: string;
  coins: number;
  bonus: number;
  priceKsh: number;
  badge?: string;
}

export type AppLanguage = 'en' | 'sw';
