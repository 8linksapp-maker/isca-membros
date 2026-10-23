/**
 * Template do email de acesso (Isca Membros) — design do app:
 * bg #0a0a0a · card #141414 · accent laranja #E8743B
 * Envia email + senha criados (decisão do Bruno 2026-10-20).
 */
export function templateAcessoMembro(nome: string, email: string, senha: string): string {
  const primeiroNome = nome.trim().split(/\s+/)[0];
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Seu acesso ao curso</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Inter,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td style="padding:0 8px 16px;">
              <span style="font-family:'JetBrains Mono',Consolas,monospace;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:#a0a0a0;">// Área de membros</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:#141414;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:40px 32px;">
              <h1 style="margin:0 0 16px;font-family:'Space Grotesk',Inter,sans-serif;font-size:28px;line-height:1.2;color:#f0f0f0;letter-spacing:-0.02em;">
                Bem-vindo ao curso, <span style="color:#e8743b;">${escapeHtml(primeiroNome)}</span> 🎓
              </h1>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#a0a0a0;">
                Sua conta foi criada. Guarde seus dados de acesso abaixo:
              </p>
              <!-- credenciais -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e1e1e;border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin:0 0 24px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <span style="font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:#a0a0a0;">Email</span><br>
                    <span style="font-size:16px;color:#f0f0f0;">${escapeHtml(email)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <span style="font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:#a0a0a0;">Senha</span><br>
                    <span style="font-size:16px;color:#f0f0f0;">${escapeHtml(senha)}</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#e8743b;border-radius:10px;">
                    <a href="https://links.brunomedeiroseo.com.br/membros" target="_blank" style="display:inline-block;padding:14px 24px;font-family:'Space Grotesk',Inter,sans-serif;font-weight:600;font-size:15px;color:#1a0d05;text-decoration:none;">
                      Entrar no curso →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#a0a0a0;">
                Guarde este email — você precisará dele para entrar na área de membros.
              </p>
              <p style="margin:12px 0 0;font-family:'JetBrains Mono',Consolas,monospace;font-size:12px;color:#a0a0a0;">
                — Bruno Medeiros
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
