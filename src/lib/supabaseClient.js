import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_URL.includes('tu-proyecto-id')) {
  console.warn(
    'Supabase URL o Anon Key faltante o por defecto. Activando modo local.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
