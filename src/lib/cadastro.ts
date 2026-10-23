import { z } from 'zod';
import { supabaseServer } from './supabase';
import { enviarEmail } from './email';
import { templateAcessoMembro } from './email-acesso';

export const cadastroSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatório').max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email inválido')
    .max(254),
  senha: z.string().min(8, 'Senha mínima de 8 caracteres').max(72),
});

export type CadastroInput = z.infer<typeof cadastroSchema>;

export type ResultadoCadastro =
  | { ok: true }
  | { ok: false; status: 400 | 409 | 500; erro: string };

/**
 * Cria a conta sem confirmação de email, grava o perfil e envia
 * o email de acesso (com senha — decisão do Bruno).
 * Email best-effort: se o Brevo falhar, a conta já existe e o login funciona.
 */
export async function criarConta(input: CadastroInput): Promise<ResultadoCadastro> {
  const { nome, email, senha } = cadastroSchema.parse(input);
  const admin = supabaseServer();

  const { data: criado, error } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true, // entra direto — sem confirmação
    user_metadata: { nome },
  });

  if (error) {
    if (error.message.toLowerCase().includes('already')) {
      return { ok: false, status: 409, erro: 'Email já cadastrado. Faça login.' };
    }
    console.error('[cadastro] auth admin:', error.message);
    return { ok: false, status: 500, erro: 'Não foi possível criar a conta. Tente novamente.' };
  }

  const { error: perfilError } = await admin
    .from('members')
    .insert({ user_id: criado.user.id, nome });

  if (perfilError) {
    // conta criada mas perfil falhou — loga e segue (login ainda funciona)
    console.error('[cadastro] members insert:', perfilError.message);
  }

  // best-effort — não bloqueia o cadastro se o Brevo falhar
  try {
    await enviarEmail({
      paraEmail: email,
      paraNome: nome,
      assunto: 'Seu acesso ao curso gratuito 🎓',
      html: templateAcessoMembro(nome, email, senha),
    });
  } catch (err) {
    console.error(
      '[cadastro] falha ao enviar email de acesso (conta já criada):',
      err instanceof Error ? err.message : err,
    );
  }

  return { ok: true };
}
