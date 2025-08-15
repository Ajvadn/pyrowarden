// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { DATABASE_CONFIG } from '@/config/database';

const SUPABASE_URL = DATABASE_CONFIG.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = DATABASE_CONFIG.SUPABASE_ANON_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});