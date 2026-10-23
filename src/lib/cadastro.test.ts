import { describe, it, expect, vi, beforeEach } from 'vitest';
import { criarConta, cadastroSchema } from './cadastro';

// --- mocks ---
const createUser = vi.fn();
const insert = vi.fn(() => ({ error: null }));
const enviarEmailMock = vi.fn(async () => true);

vi.mock('./supabase', () => ({
  supabaseServer: () => ({
    auth: { admin: { createUser: (...a: unknown[]) => createUser(...(a as [])) } },
    from: () => ({ insert: (...a: unknown[]) => insert(...(a as [])) }),
  }),
}));

vi.mock('./email', () => ({
  enviarEmail: (...a: unknown[]) => enviarEmailMock(...(a as [])),
}));

const input = { nome: 'Bruno', email: 'bruno@teste.com', senha: 'senhaForte123' };

describe('criarConta', () => {
  beforeEach(() => {
    createUser.mockReset();
    insert.mockReset();
    enviarEmailMock.mockReset();
    insert.mockImplementation(() => ({ error: null }));
    createUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    enviarEmailMock.mockResolvedValue(true);
  });

  it('cria conta SEM confirmação de email e grava o perfil', async () => {
    const r = await criarConta(input);

    expect(r).toEqual({ ok: true });
    expect(createUser).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledWith({
      email: 'bruno@teste.com',
      password: 'senhaForte123',
      email_confirm: true, // entra direto, sem confirmação
      user_metadata: { nome: 'Bruno' },
    });
    expect(insert).toHaveBeenCalledWith({ user_id: 'user-123', nome: 'Bruno' });
  });

  it('envia email de acesso com email e senha', async () => {
    await criarConta(input);

    expect(enviarEmailMock).toHaveBeenCalledTimes(1);
    const params = enviarEmailMock.mock.calls[0][0] as any;
    expect(params.paraEmail).toBe('bruno@teste.com');
    expect(params.html).toContain('senhaForte123');
    expect(params.html).toContain('bruno@teste.com');
  });

  it('email já cadastrado → 409 e NÃO envia email', async () => {
    createUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'A user with this email address has already been registered' },
    });

    const r = await criarConta(input);

    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(409);
    expect(enviarEmailMock).not.toHaveBeenCalled();
  });

  it('falha do Brevo não derruba a conta (best-effort)', async () => {
    enviarEmailMock.mockRejectedValue(new Error('brevo fora'));

    const r = await criarConta(input);

    expect(r).toEqual({ ok: true });
  });
});

describe('cadastroSchema', () => {
  it('rejeita senha menor que 8 chars', () => {
    expect(cadastroSchema.safeParse({ ...input, senha: '123' }).success).toBe(false);
  });

  it('rejeita email inválido', () => {
    expect(cadastroSchema.safeParse({ ...input, email: 'nao-e-email' }).success).toBe(false);
  });

  it('rejeita nome vazio', () => {
    expect(cadastroSchema.safeParse({ ...input, nome: '  ' }).success).toBe(false);
  });
});
