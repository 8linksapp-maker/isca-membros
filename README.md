# Isca Membros — Área de Membros / Curso Gratuito

Área restrita do canal **Bruno Medeiros**: cadastro e login por email+senha, dashboard
do curso e página de aula. Cada membro recebe um email de acesso **com o login e a
senha criados** (decisão do produto).

## Funcionalidades

- **`/`** — redireciona direto para `/membros` (tela de acesso)
- **`/membros`** — abas Entrar / Criar conta (client Supabase, sessão cookie)
- **`/app`** — dashboard protegido (3 módulos × 2 aulas placeholder, logout)
- **`/app/aula/[id]`** — player placeholder "vídeo em breve" (B2/Backblaze pendente)
- **`POST /api/cadastro`** — `admin.createUser({ email_confirm: true })` (entra sem
  confirmação) + grava perfil em `members` + email Brevo com **email e senha**
- **Middleware de sessão** — `/app/*` sem login → `/membros`; logado em `/membros` → `/app`
- **RLS** — membro autenticado só lê o próprio perfil (`user_id = auth.uid()`)
- Rotas privadas com `noindex,nofollow`

## Stack

| Camada | Escolha |
|---|---|
| App | Astro 5 (SSR) + `@astrojs/cloudflare` |
| Auth | Supabase Auth (email+senha, sessão via cookie com `@supabase/ssr`) |
| Banco | Supabase (tabela `members` + RLS) |
| Email | Brevo (boas-vindas com credenciais) |
| Conteúdo | `src/data/curso.ts` hardcoded (mesmo shape migra p/ banco depois) |

## Deploy no Cloudflare Pages — LEIA ISTO

1. Create > Pages > Connect to Git > este repo
2. Framework preset `Astro` · Build `npm run build` · Output `dist` · Root vazio · Deploy command **vazio**
3. **Duas seções de env — as duas são obrigatórias:**

**Runtime** (Settings > Environment variables > Production):

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
BREVO_API_KEY
BREVO_SENDER_EMAIL
```

**Build-time** (Settings > **Build & deployment** > Build configuration > Environment variables — entram no bundle do browser!):

```
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY
```

Sem as `PUBLIC_` no build, o login/cadastro client-side quebra (vira 401 do Supabase).

## Pendências (backlog)

- **Backblaze B2**: bucket será criado pelo Bruno — quando existir, colocar URL real em
  `src/data/curso.ts` (`videoUrl`) e trocar placeholder por `<video>`
- **Nome real do curso + módulos/aulas** — hoje é placeholder
- **Custom domain**: CTA do email aponta `links.brunomedeiroseo.com.br/membros` —
  bindar domínio no Pages ou ajustar quando o domínio definitivo existir

## Testes

```bash
npm install
npm test        # 7/7 (cadastro, duplicado 409, email best-effort, validações)
npm run build
```

## Estrutura

```
src/
├── data/curso.ts            # 3 módulos × 2 aulas (placeholder)
├── lib/
│   ├── cadastro.ts          # admin.createUser + insert members + email (testável)
│   ├── supabase.ts          # service_role lazy
│   ├── supabase-browser.ts  # createBrowserClient (@supabase/ssr)
│   ├── runtime-env.ts       # vars de runtime CF (server)
│   ├── email.ts             # cliente Brevo
│   └── email-acesso.ts      # template dark com credenciais
├── middleware.ts            # proteção /app + captura env runtime
├── pages/                   # index redirect, membros, app, app/aula/[id], api/cadastro
└── supabase/migrations/     # members + RLS select próprio
```

Feito para **Bruno Medeiros** | Operação 8Links
