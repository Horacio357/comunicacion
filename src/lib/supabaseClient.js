import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('tu-proyecto-id')) {
  console.warn(
    'Supabase URL o Anon Key faltante o por defecto. Por favor configura tu archivo .env con las claves de tu proyecto.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
