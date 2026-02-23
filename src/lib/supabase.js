import { createClient } from '@supabase/supabase-js';

// ⚠️ Reemplaza con tus credenciales de Supabase
// Las encontrarás en: Settings > API > Project URL & anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://TU-PROYECTO.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU-ANON-KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
