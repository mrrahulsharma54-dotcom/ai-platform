import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Safe retrieval of Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface AuthState {
  user: User | { id: string; email: string; user_metadata?: { full_name?: string } } | null;
  loading: boolean;
  isGuest: boolean;
}

// Local storage fallback for guest/offline sessions when Supabase is not yet configured
const LOCAL_STORAGE_USER_KEY = 'boxput_auth_user';

export function getLocalUser(): User | { id: string; email: string; user_metadata?: { full_name?: string } } | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read local user', e);
  }
  return null;
}

export function setLocalUser(user: any): void {
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to write local user', e);
  }
}
