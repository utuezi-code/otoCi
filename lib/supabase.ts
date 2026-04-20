import { createClient } from '@supabase/supabase-js';

// Ces variables ne sont accessibles que côté serveur (API routes)
// Elles ne sont JAMAIS envoyées au navigateur
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY manquantes dans .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
