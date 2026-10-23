export interface Aula {
  id: string;
  titulo: string;
  duracao: string;
  /** URL do vídeo (Backblaze B2 quando o bucket existir). */
  videoUrl?: string;
}

export interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  aulas: Aula[];
}

/**
 * Conteúdo placeholder do curso (decisão: hardcoded até virar real;
 * mesmo shape facilita a migração pra Supabase depois — data/curso.ts).
 */
export const CURSO: Modulo[] = [
  {
    id: 'm1',
    titulo: 'Fundamentos de SEO',
    descricao: 'O que é SEO e por onde começar.',
    aulas: [
      { id: 'm1a1', titulo: 'O que é SEO e por que importa', duracao: '12 min' },
      { id: 'm1a2', titulo: 'Como o Google escolhe quem aparece', duracao: '15 min' },
    ],
  },
  {
    id: 'm2',
    titulo: 'Pesquisa de Palavras-chave',
    descricao: 'Encontrando o que as pessoas procuram.',
    aulas: [
      { id: 'm2a1', titulo: 'Ferramentas de palavras-chave', duracao: '18 min' },
      { id: 'm2a2', titulo: 'Intenção de busca na prática', duracao: '14 min' },
    ],
  },
  {
    id: 'm3',
    titulo: 'SEO Técnico na Prática',
    descricao: 'Velocidade, indexação e estrutura.',
    aulas: [
      { id: 'm3a1', titulo: 'Velocidade e Core Web Vitals', duracao: '20 min' },
      { id: 'm3a2', titulo: 'Indexação: deixando o Google te ver', duracao: '16 min' },
    ],
  },
];

export function aulaPorId(id: string): { aula: Aula; modulo: Modulo } | undefined {
  for (const modulo of CURSO) {
    const aula = modulo.aulas.find((a) => a.id === id);
    if (aula) return { aula, modulo };
  }
  return undefined;
}
