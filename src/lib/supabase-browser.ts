import { createBrowserClient } from '@supabase/ssr';

export function supabaseBrowser() {
  const url =
    (import.meta.env.PUBLIC_SUPABASE_URL as string) ||
    (import.meta.env.SUPABASE_URL as string);
  const key =
    (import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string) ||
    (import.meta.env.SUPABASE_ANON_KEY as string);

  if (!url || !key) {
    throw new Error('[supabase-browser] SUPABASE env ausente no browser');
  }

  return createBrowserClient(url, key);
}
