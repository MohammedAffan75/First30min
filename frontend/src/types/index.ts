export interface User {
  id: number;
  email: string;
  nickname: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface UserProfile {
  nickname: string;
  support_tone: "Mother-to-Son" | "Father-to-Daughter" | "Neutral" | "BUA Mode";
  favourite_food?: string;
  preferred_music?: string;
  comfort_activities?: string;
  behavioural_notes?: string;
}

export interface EmergencyContact {
  id: number;
  label: string;
  name: string;
  phone: string;
}

export type Severity = "Low" | "Moderate" | "High" | null;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  severity?: Severity;
  timestamp?: Date;
}

export interface CrisisResource {
  name: string;
  number: string;
  region: string;
  available: string;
}

export interface ChatResponse {
  reply: string;
  severity?: Severity;
  crisis_resources?: CrisisResource[];
  suggested_actions?: string[];
  session_id?: number;
  motivational_story?: { title: string; story: string };
  suggested_song?: { title: string; artist: string; vibe: string };
  suggested_movie?: { title: string; type: string; reason: string };
}
