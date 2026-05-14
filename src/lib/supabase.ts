import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uzttjedryajsmngvpaqu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dHRqZWRyeWFqc21uZ3ZwYXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTIwMDIsImV4cCI6MjA4ODU2ODAwMn0.Z965K_V6FRceBL1jP7zMls4QVYbpjPP9JcoRHUkAwUg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (...args) => fetch(args[0], { ...args[1], cache: 'no-store' }),
  },
});
