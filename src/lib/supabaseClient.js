import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(
  rawUrl &&
  rawKey &&
  typeof rawUrl === 'string' &&
  typeof rawKey === 'string' &&
  rawUrl.startsWith('http') &&
  !rawUrl.includes('tu-proyecto-id') &&
  !rawKey.includes('tu-anon-key')
);

// If real credentials are provided, use real client; otherwise provide a safe mock client that never throws
export const supabase = isConfigured
  ? createClient(rawUrl, rawKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: { session: null, user: null }, error: new Error('Modo demo activo') }),
        signUp: async () => ({ data: { session: null, user: null }, error: new Error('Modo demo activo') }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null })
          })
        })
      })
    };
