import { createServerClient } from '@supabase/ssr';
import { defineMiddleware } from 'astro:middleware';
import { setRuntimeEnv, getVar } from './lib/runtime-env';

function parseCookieHeader(header: string | null) {
  if (!header) return [];
  const out: Array<{ name: string; value: string }> = [];
  for (const part of header.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const name = trimmed.slice(0, idx);
    const value = trimmed.slice(idx + 1);
    out.push({ name, value });
  }
  return out;
}

/**
 * Sessão + proteção de rotas (Isca Membros)
 */
export const onRequest = defineMiddleware(async (context, next) => {
  // captura vars do runtime CF (prod) antes de qualquer leitura de env
  const runtime = (context.locals as Record<string, unknown>).runtime as
    | { env?: Record<string, unknown> }
    | undefined;
  if (runtime?.env) {
    setRuntimeEnv(runtime.env);
  }

  const url = context.url.pathname;
  const ehRotaPrivada = url.startsWith('/app');
  const ehRotaLogin = url === '/membros' || url === '/membros/';

  const supabase = createServerClient(
    getVar('SUPABASE_URL'),
    getVar('SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          // @ts-ignore - Astro.cookies nem sempre expõe getAll
          if (typeof (context.cookies as any).getAll === 'function') {
            // @ts-ignore
            const all = (context.cookies as any).getAll();
            if (Array.isArray(all)) {
              return all.map((c: any) => ({ name: c.name, value: c.value }));
            }
          }
          return parseCookieHeader(context.request.headers.get('cookie'));
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            context.cookies.set(name, value, options as any);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (ehRotaPrivada && !user) {
    return context.redirect('/membros');
  }
  if (ehRotaLogin && user) {
    return context.redirect('/app');
  }

  return next();
});
