export type SupabaseClientLike = {
  url?: string;
  key?: string;
};

export const supabase: SupabaseClientLike = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co',
  key: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'demo-key',
};

export default supabase;
